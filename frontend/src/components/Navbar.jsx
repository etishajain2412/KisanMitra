import React from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Button } from "react-bootstrap"; // ShadCN button

const MyNavbar = () => {
  const navigate = useNavigate();

  // Handle navigation to Login page
  const handleLogin = () => {
    navigate('/login');
  };

  // Handle navigation to Register page
  const handleRegister = () => {
    navigate('/register');
  };
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
            <Nav.Link as={Link} to="/profile">My Profile</Nav.Link>
          </Nav>
          <Button
              onClick={handleLogin}
              className="btn btn-primary ms-3"
            >
              Login
            </Button>
  
            {/* Register Button */}
            <Button
              onClick={handleRegister}
              className="btn btn-success ms-3"
            >
              Register
            </Button>
          {/* <Button variant="primary" className="ms-3">Login</Button> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
