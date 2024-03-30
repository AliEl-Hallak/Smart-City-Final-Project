import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome,faSignOutAlt ,faDumpster,faCar,faHouseDamage  } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css'; // Navbar CSS dosyasını import edin
const CustomNavbar = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark" className="navbar">
      <LinkContainer to="/ev">
        <Navbar.Brand className="navbar-brand">Smart City</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mx-auto">
       
          <LinkContainer to="/ev" activeClassName="active">
            <Nav.Link className="nav-item nav-link"><FontAwesomeIcon icon={faHome} /></Nav.Link>
          </LinkContainer>
          <LinkContainer to="/park" activeClassName="active">
            <Nav.Link className="nav-item nav-link"><FontAwesomeIcon icon={faCar} /></Nav.Link>
          </LinkContainer>
          <LinkContainer to="/cop" activeClassName="active">
            <Nav.Link className="nav-item nav-link"> <FontAwesomeIcon icon={faDumpster}></FontAwesomeIcon></Nav.Link>
          </LinkContainer>
        </Nav>
        <Nav className="ml-auto">
          <LinkContainer to="/" className="nav-item nav-link text-white">
            <Nav.Link>
              <FontAwesomeIcon icon={faSignOutAlt} className="fa-sign-out-alt" />
            </Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
