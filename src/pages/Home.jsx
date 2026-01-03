import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const Home = () => {
  const featuredProducts = products.slice(0, 6);

  return (
    <>
      <div className="hero-section">
        <Container>
          <Row>
            <Col md={8} className="mx-auto text-center">
              <h1 className="display-4 mb-4" style={{ 
                background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 30px rgba(0, 245, 255, 0.5)',
                fontWeight: '700',
                letterSpacing: '2px'
              }}>
                WELCOME TO THE FUTURE
              </h1>
              <p className="lead mb-4" style={{ fontSize: '1.3rem', color: '#a5b4fc' }}>
                Experience cutting-edge technology and premium products. 
                Step into tomorrow, today.
              </p>
              <Link to="/products">
                <Button variant="primary" size="lg" style={{ 
                  padding: '12px 40px',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}>
                  EXPLORE NOW →
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="text-center mb-4" style={{
              background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '700',
              letterSpacing: '3px',
              textTransform: 'uppercase'
            }}>
              Featured Products
            </h2>
          </Col>
        </Row>
        <Row>
          {featuredProducts.map((product) => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={4} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
        <Row className="mt-5">
          <Col className="text-center">
            <Link to="/products">
              <Button variant="outline-primary" size="lg">
                View All Products
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;

