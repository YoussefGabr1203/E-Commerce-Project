import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <Card className="product-card h-100">
      <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Card.Img
          variant="top"
          src={product.image}
          className="product-image"
          alt={product.name}
        />
      </Link>
      <Card.Body className="d-flex flex-column">
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Card.Title style={{ color: '#e0e7ff', fontWeight: '600' }}>{product.name}</Card.Title>
          <Card.Text style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>{product.description}</Card.Text>
        </Link>
        <div className="mt-auto">
          <div className="mb-2">
            <span className="price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="old-price">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <div className="mb-2">
            <Badge bg="success">⭐ {product.rating}</Badge>
            {product.inStock ? (
              <Badge bg="info" className="ms-2">In Stock</Badge>
            ) : (
              <Badge bg="secondary" className="ms-2">Out of Stock</Badge>
            )}
          </div>
          <Button
            variant="primary"
            className="w-100"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            {product.inStock ? '⚡ ADD TO CART' : 'Out of Stock'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;

