import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Button } from "react-bootstrap";

const HomePage = () => {
  return (
    <Container className="mt-5 text-center">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1>🌾 Welcome to Kisan Mitra</h1>
          
          <Button as="a" href="/weather" className="mt-3">
            Check Weather 🌤
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
