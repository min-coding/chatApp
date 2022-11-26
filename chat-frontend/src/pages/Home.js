import React from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function Home() {
  return (
    <>
      <Row>
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
        >
          <div>
            <h1> Some title</h1>
            <p> slogan</p>
            <LinkContainer to="/chat">
              <Button variant="success">
                Get started
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
