import React from "react";

import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Button } from "react-bootstrap"; // ShadCN button

const MyNavbar = () => {
  return (
    <Navbar expand="lg" className="navbar navbar-dark bg-dark">
      <Container>
        <Navbar.Brand as={Link} to="/">🚜 Kisan Mitra</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/weather">Weather</Nav.Link>
            <Nav.Link as={Link} to="/farming-tips">Farming Tips</Nav.Link>
          </Nav>
          <Button variant="primary" className="ms-3">Login</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
