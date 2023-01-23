import React from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function Home() {
  return (
    <>
      <Row>
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center p-5"
        >
          <div>
            <h1> Welcome to Min's chat application</h1>
            <p> Check it out!</p>
            <LinkContainer to="/chat">
              <Button variant="success mt-3">
                Start chatting
                <i className="fas fa-comments home-message-icon"></i>
              </Button>
            </LinkContainer>
          </div>
        </Col>
        <Col md={6} className="hero-bg"></Col>
      </Row>
    </>
  );
}
