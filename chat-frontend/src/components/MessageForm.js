import React from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';

export default function MessageForm() {
  const handleSubmit = (e) => {
    e.preventDefault();

    // return (

    // )
  };

  return (
    <>
      <div className="message-output"></div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Your message"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button type="submit" variant="primary">
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
