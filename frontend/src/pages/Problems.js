import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Form, Button, Pagination, Container, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { problemsAPI, userAPI } from '../services/api';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    difficulty: '',
    category: '',
    search: '',
    page: 1
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchCategories();
    fetchBookmarks();
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await problemsAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBookmarks = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await userAPI.getBookmarks();
      setBookmarks(response.data.bookmarks.map(b => b.id || b._id));
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const response = await problemsAPI.getProblems(filters);
      setProblems(response.data.problems);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        total: response.data.pagination.totalProblems
      });
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (e, problemId) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const isBookmarked = bookmarks.includes(problemId);
    try {
      if (isBookmarked) {
        await problemsAPI.unbookmarkProblem(problemId);
        setBookmarks(prev => prev.filter(id => id !== problemId));
      } else {
        await problemsAPI.bookmarkProblem(problemId);
        setBookmarks(prev => [...prev, problemId]);
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProblems();
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h1 className="display-5 fw-bold text-white mb-3">Coding Problems</h1>
        <p className="text-white-50">
          Practice coding challenges and improve your skills
        </p>
      </div>

      <Card className="bg-dark text-white mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Control
                  type="text"
                  name="search"
                  placeholder="Search problems..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </Col>
              <Col md={2}>
                <Form.Select name="difficulty" value={filters.difficulty} onChange={handleFilterChange}>
                  <option value="">All ▾</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select name="category" value={filters.category} onChange={handleFilterChange}>
                  <option value="">All ▾</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Button type="submit" variant="primary" className="w-100">
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-3 text-white-50">
            Showing {problems.length} of {pagination.total} problems
          </div>

          <Row className="g-4">
            {problems.map((problem) => (
              <Col key={problem.id} md={6} lg={4}>
                <Card 
                  className="bg-dark text-white h-100 problem-card border-0"
                  onClick={() => navigate(`/problems/${problem.id}`)}
                >
                  <Card.Body className="d-flex flex-column p-4">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="mb-0 text-primary">{problem.title}</h5>
                        <Badge bg={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                      </div>
                      <div className="mb-3">
                        <Badge bg="secondary" className="opacity-75">{problem.category}</Badge>
                      </div>
                      <p className="text-white-50 small mb-0 line-clamp-3">
                        {problem.description}
                      </p>
                    </div>
                    
                    <div className="mt-auto pt-3 border-top border-secondary">
                      <div className="d-flex justify-content-between align-items-center text-white-50 small">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center me-3">
                            <span className="me-1">💎</span>
                            {problem.points} pts
                          </div>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>{bookmarks.includes(problem.id) ? 'Remove Bookmark' : 'Add Bookmark'}</Tooltip>}
                          >
                            <Button
                              variant="link"
                              className="p-0 text-decoration-none bookmark-btn"
                              onClick={(e) => handleBookmark(e, problem.id)}
                            >
                              <span style={{ fontSize: '1.2rem' }}>
                                {bookmarks.includes(problem.id) ? '🔖' : '📑'}
                              </span>
                            </Button>
                          </OverlayTrigger>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="me-1">👥</span>
                          {problem.solvedBy} solved
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

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
                  const isNearCurrent = Math.abs(page - pagination.currentPage) <= 2 ||
                    page === 1 || page === pagination.totalPages;
                  
                  if (!isNearCurrent && page !== 1 && page !== pagination.totalPages) {
                    return null;
                  }
                  
                  if (!isNearCurrent && page === pagination.totalPages - 1) {
                    return <Pagination.Ellipsis key="ellipsis1" disabled />;
                  }
                  
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
        </>
      )}
    </Container>
  );
};

export default Problems;
