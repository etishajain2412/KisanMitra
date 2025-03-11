import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Card } from "react-bootstrap";

const farmingTips = [
  { month: "January", tip: "Start preparing fields for early crops." },
  { month: "March", tip: "Ideal time for sowing summer vegetables." },
  { month: "June", tip: "Monitor water levels in monsoon season." },
  { month: "September", tip: "Harvest paddy and begin winter crop sowing." },
];

const FarmingTips = () => {
  const { t, i18n } = useTranslation();
  return (
    <Container className="mt-4" id="farming-tips">
      <h2 className="text-center">Farming Calendar</h2>
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
