import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const farmingTips = [
  { month: "January", tip: "Prepare fields for early crops." },
  { month: "March", tip: "Ideal time for summer vegetables." },
  { month: "June", tip: "Monitor water levels during monsoon." },
  { month: "September", tip: "Harvest paddy and plant winter crops." },
];

const FarmingTips = () => {
  return (
    <Container className="mt-4">
      <h2 className="text-center">📅 Farming Calendar</h2>
      <Row className="mt-3">
        {farmingTips.map((tip, index) => (
          <Col md={3} key={index}>
            <Card className="p-3 text-center shadow-lg">
              <Card.Title>{tip.month}</Card.Title>
              <Card.Text>{tip.tip}</Card.Text>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FarmingTips;
