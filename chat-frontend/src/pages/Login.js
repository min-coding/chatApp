import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../services/appApi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //hooks
  const [loginUser, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    //logic logic
    loginUser({ email, password }).then(({ data }) => {
      if (data) {
        //socket work
        //navigate to the chat
        navigate('/chat');
      }
    });
  };

  return (
    <Row>
      <Col md={5} className="login_bg"></Col>

      <Col
        md={7}
        className="d-flex flex-direction-column align-items-center justify-content-center"
      >
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Login
          </Button>
          <div className="d-flex">
            {/* <div className="py-4"> */}
            <p className="text-center">Don't have an account?</p>
            <Link to="/signup">Sign Up</Link>
          </div>
        </Form>
      </Col>
    </Row>
  );
}
