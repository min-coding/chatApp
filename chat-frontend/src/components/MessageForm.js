import React from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';

export default function MessageForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const user = useSelector((state) => state.user);

  return (
    <>
      <div className="message-output">
        {!user && <div className="alert alert-danger"> Please login </div>}
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Your message"
                disabled={!user}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button type="submit" variant="primary" disable={!user}>
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
