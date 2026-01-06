import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Button, Modal, Alert, Spinner, Pagination, Card } from 'react-bootstrap';
import { fetchAllCarts, fetchCartById, addCart, updateCart, deleteCart, fetchCartsByUser } from '../../services/api';

const CartsManagement = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [userIdFilter, setUserIdFilter] = useState('');
  const limit = 10;

  useEffect(() => {
    loadCarts();
  }, [currentPage, userIdFilter]);

  const loadCarts = async () => {
    try {
      setLoading(true);
      setError('');
      let data;
      
      if (userIdFilter) {
        data = await fetchCartsByUser(userIdFilter);
        setCarts(data.carts || []);
        setTotal(data.carts?.length || 0);
      } else {
        const skip = (currentPage - 1) * limit;
        data = await fetchAllCarts(limit, skip);
        setCarts(data.carts || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      setError('Failed to load carts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const cart = await fetchCartById(id);
      setSelectedCart(cart);
      setShowModal(true);
    } catch (err) {
      setError('Failed to load cart details');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cart?')) {
      try {
        await deleteCart(id);
        loadCarts();
      } catch (err) {
        setError('Failed to delete cart');
      }
    }
  };

  const calculateTotal = (cart) => {
    if (!cart.products) return 0;
    return cart.products.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 style={{ color: '#e0e7ff' }}>Carts Management</h3>
        <div>
          <input
            type="number"
            placeholder="Filter by User ID"
            value={userIdFilter}
            onChange={(e) => {
              setUserIdFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="form-control d-inline-block me-2"
            style={{ width: '200px' }}
          />
          <Button variant="outline-secondary" onClick={() => {
            setUserIdFilter('');
            setCurrentPage(1);
          }}>
            Clear Filter
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Table responsive striped bordered hover style={{ color: '#e0e7ff' }}>
            <thead>
              <tr>
                <th>Cart ID</th>
                <th>User ID</th>
                <th>Items</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {carts.map((cart) => (
                <tr key={cart.id}>
                  <td>{cart.id}</td>
                  <td>{cart.userId}</td>
                  <td>{cart.totalProducts || (cart.products?.length || 0)}</td>
                  <td>${calculateTotal(cart).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleView(cart.id)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(cart.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {!userIdFilter && (
            <Pagination>
              <Pagination.First
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = currentPage - 2 + i;
                if (page < 1 || page > totalPages) return null;
                return (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                );
              })}
              <Pagination.Next
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          )}
        </>
      )}

      {/* Cart Detail Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
      >
        <Modal.Header closeButton style={{ background: 'rgba(26, 31, 58, 0.95)', borderBottom: '1px solid rgba(0, 245, 255, 0.2)' }}>
          <Modal.Title style={{ color: '#00f5ff' }}>
            Cart Details #{selectedCart?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: 'rgba(26, 31, 58, 0.95)' }}>
          {selectedCart && (
            <>
              <Row className="mb-3">
                <Col>
                  <strong style={{ color: '#00f5ff' }}>User ID:</strong> {selectedCart.userId}
                </Col>
                <Col>
                  <strong style={{ color: '#00f5ff' }}>Total Items:</strong> {selectedCart.totalProducts || selectedCart.products?.length || 0}
                </Col>
              </Row>
              <Table striped bordered hover style={{ color: '#e0e7ff' }}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCart.products?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.title || item.name}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price?.toFixed(2)}</td>
                      <td>${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3}><strong>Grand Total:</strong></td>
                    <td><strong>${calculateTotal(selectedCart).toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </Table>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CartsManagement;

