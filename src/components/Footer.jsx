import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer mt-auto">
      <Container>
        <Row>
          <Col md={4}>
            <h5>About Us</h5>
            <p>Your trusted online store for quality products at great prices.</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/products" style={{ color: 'white', textDecoration: 'none' }}>Products</a></li>
              <li><a href="/cart" style={{ color: 'white', textDecoration: 'none' }}>Shopping Cart</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact</h5>
            <p>Email: Gabr@estore.com</p>
            <p>Phone: +02 0128765213</p>
          </Col>
        </Row>
        <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        <Row>
          <Col className="text-center">
            <p>&copy; {new Date().getFullYear()} E-Store. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

