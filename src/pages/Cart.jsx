import React from 'react';
import { Container, Row, Col, Table, Button, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <Container className="my-5">
        <Alert variant="info">
          <Alert.Heading>Your cart is empty</Alert.Heading>
          <p>Start shopping to add items to your cart!</p>
            <Button variant="primary" onClick={() => navigate('/products')}>
            ⚡ Browse Products
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h1 className="mb-4" style={{
            background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '700',
            letterSpacing: '2px'
          }}>
            Shopping Cart
          </h1>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          marginRight: '15px',
                        }}
                        className="rounded"
                      />
                      <div>
                        <strong>{item.name}</strong>
                      </div>
                    </div>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="mx-3">{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="outline-danger" onClick={clearCart}>
            Clear Cart
          </Button>
        </Col>
        <Col md={4}>
          <div className="border p-4 rounded">
            <h3>Order Summary</h3>
            <hr />
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span>Tax:</span>
              <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-4">
              <strong>Total:</strong>
              <strong className="price">
                ${(getTotalPrice() * 1.1).toFixed(2)}
              </strong>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-100"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;

