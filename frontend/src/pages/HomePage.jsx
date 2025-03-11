import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";


const HomePage = () => {
  const { t, i18n } = useTranslation();
  return (
    <Container className="mt-5 text-center">
      <Row className="justify-content-center">
        <Col md={8}>
          
         
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
