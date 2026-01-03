import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Alert } from 'react-bootstrap';
import { getProductById } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showAlert, setShowAlert] = useState(false);

  if (!product) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <Alert.Heading>Product Not Found</Alert.Heading>
          <p>The product you're looking for doesn't exist.</p>
          <Button variant="primary" onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </Alert>
      </Container>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <Container className="my-5">
      {showAlert && (
        <Alert variant="success" dismissible onClose={() => setShowAlert(false)}>
          Product added to cart successfully!
        </Alert>
      )}
      <Row>
        <Col md={6}>
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded"
            style={{ width: '100%', height: '500px', objectFit: 'cover' }}
          />
        </Col>
        <Col md={6}>
          <h1 style={{ color: '#e0e7ff', fontWeight: '700' }}>{product.name}</h1>
          <div className="mb-3">
            <Badge bg="success" className="me-2">⭐ {product.rating}</Badge>
            <Badge bg={product.inStock ? 'info' : 'secondary'}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>
          <div className="mb-3">
            <span className="price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="old-price">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <p style={{ color: '#a5b4fc', fontSize: '1.1rem' }} className="mb-4">{product.description}</p>
          <div className="mb-3" style={{ color: '#a5b4fc' }}>
            <strong style={{ color: '#00f5ff' }}>Category:</strong> {product.category}
          </div>
          {product.inStock && (
            <div className="mb-3">
              <label htmlFor="quantity" className="me-2">
                <strong>Quantity:</strong>
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="form-control d-inline-block"
                style={{ width: '100px' }}
              />
            </div>
          )}
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {product.inStock ? '⚡ ADD TO CART' : 'Out of Stock'}
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate('/products')}>
              Back to Products
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;

