import React from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Button } from "react-bootstrap"; // ShadCN button
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const MyNavbar = () => {
  const { t, i18n } = useTranslation();
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
        <Navbar.Brand as={Link} to="/">{t("brand")}</Navbar.Brand>
        <LanguageSwitcher />
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">{t("home")}</Nav.Link>
            <Nav.Link as={Link} to="/weather">{t("weather")}</Nav.Link>
            <Nav.Link as={Link} to="/farming-tips">{t("farming_tips")}</Nav.Link>
            <Nav.Link as={Link} to="/profile">{t("my_profile")}</Nav.Link>
          </Nav>
          <Button onClick={handleLogin} className="btn btn-primary ms-3">
            {t("login")}
          </Button>
          <Button onClick={handleRegister} className="btn btn-success ms-3">
            {t("register")}
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
