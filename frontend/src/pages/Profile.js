import React, { useState, useEffect } from 'react';
import { Card, Container, Form, Button, Badge, Row, Col, Alert } from 'react-bootstrap';
import { userAPI } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setUser(response.data.user);
      setFormData({
        username: response.data.user.username,
        email: response.data.user.email
      });
    } catch (error) {
      setError('Failed to fetch profile');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await userAPI.updateProfile(formData);
      setUser(response.data.user);
      setMessage('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      username: user.username,
      email: user.email
    });
    setError('');
    setMessage('');
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-5">
        <h1 className="display-4 fw-bold text-white mb-3">Profile</h1>
        <p className="lead text-white-50">
          Manage your account and track your progress
        </p>
      </div>

      {message && <Alert variant="success" className="mb-4">{message}</Alert>}
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Row>
        <Col md={8}>
          <Card className="bg-dark text-white mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Account Information</h5>
              {!editing && (
                <Button variant="outline-primary" onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {editing ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      minLength={3}
                      maxLength={30}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button type="submit" variant="primary">
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline-secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              ) : (
                <div>
                  <Row className="mb-3">
                    <Col sm={3}>
                      <strong>Username:</strong>
                    </Col>
                    <Col sm={9}>{user.username}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={3}>
                      <strong>Email:</strong>
                    </Col>
                    <Col sm={9}>{user.email}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={3}>
                      <strong>Member Since:</strong>
                    </Col>
                    <Col sm={9}>{new Date(user.createdAt).toLocaleDateString()}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={3}>
                      <strong>Last Login:</strong>
                    </Col>
                    <Col sm={9}>{new Date(user.lastLogin).toLocaleString()}</Col>
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="bg-dark text-white mb-4">
            <Card.Header>
              <h5 className="mb-0">Statistics</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                <h2 className="text-primary">{user.points}</h2>
                <p className="mb-0">Total Points</p>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Problems Solved</span>
                <span className="fw-bold">{user.solvedProblems.length}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Current Streak</span>
                <span className="fw-bold">{user.streak} days</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Global Rank</span>
                <span className="fw-bold">#{user.rank}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Bookmarks</span>
                <span className="fw-bold">{user.bookmarkedProblems.length}</span>
              </div>
            </Card.Body>
          </Card>

          <Card className="bg-dark text-white">
            <Card.Header>
              <h5 className="mb-0">Badges</h5>
            </Card.Header>
            <Card.Body>
              {user.badges.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {user.badges.map((badge, index) => (
                    <Badge key={index} bg="info">
                      {badge}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-white-50 text-center mb-0">
                  No badges earned yet. Keep solving problems!
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
