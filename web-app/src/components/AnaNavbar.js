import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserLock      } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css'; // Navbar CSS dosyasını import edin
const CustomNavbar = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark" className="navbar">
      <LinkContainer to="/">
        <Navbar.Brand  className="navbar-brand">Smart City</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mx-auto">
       
        
        </Nav>
        <Nav className="ml-auto">
          <LinkContainer to="/login" className="nav-item nav-link text-white">
            <Nav.Link>
              <FontAwesomeIcon icon={faUserLock   } className="fa-sign-out-alt" />
            </Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
