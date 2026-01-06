import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Button, Modal, Alert, Spinner, Pagination, Form } from 'react-bootstrap';
import { fetchAllUsers, fetchUserById, searchUsers } from '../../services/api';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;

  useEffect(() => {
    if (searchTerm.trim()) {
      performSearch();
    } else {
      loadUsers();
    }
  }, [currentPage]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        performSearch();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      loadUsers();
    }
  }, [searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const skip = (currentPage - 1) * limit;
      const data = await fetchAllUsers(limit, skip);
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await searchUsers(searchTerm);
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setCurrentPage(1);
    } catch (err) {
      setError('Failed to search users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const user = await fetchUserById(id);
      setSelectedUser(user);
      setShowModal(true);
    } catch (err) {
      setError('Failed to load user details');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 style={{ color: '#e0e7ff' }}>Users Management</h3>
        <Form.Control
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '300px' }}
        />
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
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleView(user.id)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {!searchTerm && (
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

      {/* User Detail Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
      >
        <Modal.Header closeButton style={{ background: 'rgba(26, 31, 58, 0.95)', borderBottom: '1px solid rgba(0, 245, 255, 0.2)' }}>
          <Modal.Title style={{ color: '#00f5ff' }}>
            User Details #{selectedUser?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: 'rgba(26, 31, 58, 0.95)' }}>
          {selectedUser && (
            <Row>
              <Col md={6}>
                <p><strong style={{ color: '#00f5ff' }}>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                <p><strong style={{ color: '#00f5ff' }}>Username:</strong> {selectedUser.username}</p>
                <p><strong style={{ color: '#00f5ff' }}>Email:</strong> {selectedUser.email}</p>
                <p><strong style={{ color: '#00f5ff' }}>Phone:</strong> {selectedUser.phone}</p>
              </Col>
              <Col md={6}>
                <p><strong style={{ color: '#00f5ff' }}>Age:</strong> {selectedUser.age}</p>
                <p><strong style={{ color: '#00f5ff' }}>Gender:</strong> {selectedUser.gender}</p>
                <p><strong style={{ color: '#00f5ff' }}>Birth Date:</strong> {selectedUser.birthDate}</p>
                <p><strong style={{ color: '#00f5ff' }}>Address:</strong></p>
                {selectedUser.address && (
                  <p style={{ marginLeft: '20px', color: '#a5b4fc' }}>
                    {selectedUser.address.address}, {selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.postalCode}
                  </p>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UsersManagement;

