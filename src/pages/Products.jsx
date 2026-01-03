import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === '' || selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-4" style={{
            background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '700',
            letterSpacing: '3px',
            textTransform: 'uppercase'
          }}>
            Our Products
          </h1>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category === 'All' ? '' : category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center" style={{ color: '#a5b4fc' }}>No products found.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Products;

