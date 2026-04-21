import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Table, Form, Button, Pagination, Badge, Row, Col } from 'react-bootstrap';
import { userAPI } from '../services/api';

const SubmissionHistory = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    page: 1
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchSubmissions();
  }, [filters]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getSubmissions(filters);
      setSubmissions(response.data.submissions);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'success';
      case 'Wrong Answer': return 'danger';
      case 'Time Limit Exceeded': return 'warning';
      case 'Runtime Error': return 'danger';
      case 'Compilation Error': return 'warning';
      case 'Pending': return 'secondary';
      default: return 'secondary';
    }
  };

  const getLanguageBadge = (language) => {
    const colors = {
      javascript: 'warning',
      python: 'primary',
      java: 'danger',
      cpp: 'success',
      c: 'info'
    };
    return colors[language] || 'secondary';
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
        <h1 className="display-4 fw-bold text-white mb-3">Submission History</h1>
        <p className="lead text-white-50">
          Track your coding submissions and progress
        </p>
      </div>

      <Card className="bg-dark text-white mb-4">
        <Card.Body>
          <Form>
            <Row className="g-3">
              <Col md={4}>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Status</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Wrong Answer">Wrong Answer</option>
                  <option value="Time Limit Exceeded">Time Limit Exceeded</option>
                  <option value="Runtime Error">Runtime Error</option>
                  <option value="Compilation Error">Compilation Error</option>
                  <option value="Pending">Pending</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Button variant="primary" onClick={fetchSubmissions}>
                  Filter
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <div className="mb-3 text-white-50">
        Showing {submissions.length} of {pagination.total} submissions
      </div>

      <Card className="bg-dark text-white">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead className="table-dark">
              <tr>
                <th>Problem</th>
                <th>Status</th>
                <th>Language</th>
                <th>Runtime</th>
                <th>Memory</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id}>
                  <td>
                    <Link 
                      to={`/problems/${submission.problemId._id}`}
                      className="text-white text-decoration-none"
                    >
                      {submission.problemId.title}
                    </Link>
                    <div className="small text-white-50">
                      {submission.problemId.difficulty}
                    </div>
                  </td>
                  <td>
                    <Badge bg={getStatusColor(submission.status)}>
                      {submission.status}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={getLanguageBadge(submission.language)}>
                      {submission.language}
                    </Badge>
                  </td>
                  <td>
                    {submission.runtime ? `${submission.runtime}ms` : '-'}
                  </td>
                  <td>
                    {submission.memory ? `${submission.memory}MB` : '-'}
                  </td>
                  <td>
                    <div>
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </div>
                    <div className="small text-white-50">
                      {new Date(submission.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {submissions.length === 0 && (
        <Card className="bg-dark text-white text-center py-5 mt-4">
          <Card.Body>
            <h3 className="mb-3">No Submissions Yet</h3>
            <p className="text-white-50 mb-4">
              Start solving problems to see your submission history!
            </p>
            <Button as={Link} to="/problems" variant="primary">
              Browse Problems
            </Button>
          </Card.Body>
        </Card>
      )}

      {pagination.totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            />
            
            {[...Array(pagination.totalPages)].map((_, index) => {
              const page = index + 1;
              const isActive = page === pagination.currentPage;
              
              return (
                <Pagination.Item
                  key={page}
                  active={isActive}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Pagination.Item>
              );
            })}
            
            <Pagination.Next
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            />
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default SubmissionHistory;
