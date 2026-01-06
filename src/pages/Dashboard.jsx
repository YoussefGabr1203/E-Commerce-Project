import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { fetchProducts, fetchAllCarts, fetchAllUsers } from '../services/api';
import ProductsManagement from '../components/dashboard/ProductsManagement';
import CartsManagement from '../components/dashboard/CartsManagement';
import UsersManagement from '../components/dashboard/UsersManagement';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    carts: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [productsData, cartsData, usersData] = await Promise.all([
          fetchProducts(1, 0),
          fetchAllCarts(1, 0),
          fetchAllUsers(1, 0),
        ]);
        setStats({
          products: productsData.total || 0,
          carts: cartsData.total || 0,
          users: usersData.total || 0,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <Container fluid className="my-4">
      <Row className="mb-4">
        <Col>
          <h1 style={{
            background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '700',
            letterSpacing: '2px'
          }}>
            Dashboard
          </h1>
          {user && (
            <p style={{ color: '#a5b4fc' }}>
              Welcome, {user.firstName} {user.lastName}!
            </p>
          )}
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card style={{ background: 'rgba(26, 31, 58, 0.6)', border: '1px solid rgba(0, 245, 255, 0.2)' }}>
            <Card.Body>
              <h5 style={{ color: '#a5b4fc' }}>Total Products</h5>
              <h2 style={{ color: '#00f5ff', fontWeight: '700' }}>
                {loading ? '...' : stats.products}
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ background: 'rgba(26, 31, 58, 0.6)', border: '1px solid rgba(0, 245, 255, 0.2)' }}>
            <Card.Body>
              <h5 style={{ color: '#a5b4fc' }}>Total Carts</h5>
              <h2 style={{ color: '#00f5ff', fontWeight: '700' }}>
                {loading ? '...' : stats.carts}
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ background: 'rgba(26, 31, 58, 0.6)', border: '1px solid rgba(0, 245, 255, 0.2)' }}>
            <Card.Body>
              <h5 style={{ color: '#a5b4fc' }}>Total Users</h5>
              <h2 style={{ color: '#00f5ff', fontWeight: '700' }}>
                {loading ? '...' : stats.users}
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Management Tabs */}
      <Tab.Container defaultActiveKey="products">
        <Row>
          <Col md={3}>
            <Card style={{ background: 'rgba(26, 31, 58, 0.6)', border: '1px solid rgba(0, 245, 255, 0.2)' }}>
              <Card.Body>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="products" style={{ color: '#a5b4fc', marginBottom: '10px' }}>
                      📦 Products
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="carts" style={{ color: '#a5b4fc', marginBottom: '10px' }}>
                      🛒 Carts
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="users" style={{ color: '#a5b4fc' }}>
                      👥 Users
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          <Col md={9}>
            <Tab.Content>
              <Tab.Pane eventKey="products">
                <ProductsManagement />
              </Tab.Pane>
              <Tab.Pane eventKey="carts">
                <CartsManagement />
              </Tab.Pane>
              <Tab.Pane eventKey="users">
                <UsersManagement />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default Dashboard;

