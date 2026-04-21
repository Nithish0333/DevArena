import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Badge, Button, Alert } from 'react-bootstrap';
import { userAPI, problemsAPI } from '../services/api';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await userAPI.getBookmarks();
      setBookmarks(response.data.bookmarks);
    } catch (error) {
      setError('Failed to fetch bookmarks');
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (problemId) => {
    try {
      await problemsAPI.unbookmarkProblem(problemId);
      setBookmarks(bookmarks.filter(bookmark => (bookmark.id || bookmark._id) !== problemId));
    } catch (error) {
      setError('Failed to remove bookmark');
      console.error('Error removing bookmark:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'danger';
      default: return 'secondary';
    }
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
        <h1 className="display-4 fw-bold text-white mb-3">Bookmarked Problems</h1>
        <p className="lead text-white-50">
          Problems you've saved for later
        </p>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {bookmarks.length === 0 ? (
        <Card className="bg-dark text-white text-center py-5">
          <Card.Body>
            <h3 className="mb-3">No Bookmarked Problems Yet</h3>
            <p className="text-white-50 mb-4">
              Start bookmarking problems you want to solve later!
            </p>
            <Button as={Link} to="/problems" variant="primary">
              Browse Problems
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div className="row g-3">
          {bookmarks.map((problem) => (
            <div key={problem.id || problem._id} className="col-md-6">
              <Card className="bg-dark text-white h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="mb-2">
                    <h5 className="mb-2">
                      <Link to={`/problems/${problem.id || problem._id}`} className="text-white text-decoration-none">
                        {problem.title}
                      </Link>
                    </h5>
                    <div className="mb-2">
                      <Badge bg={getDifficultyColor(problem.difficulty)} className="me-2">
                        {problem.difficulty}
                      </Badge>
                      <Badge bg="secondary">{problem.category}</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="text-white-50 small">
                        <span className="me-3">{problem.points} points</span>
                        <span>{problem.solvedBy} solved</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveBookmark(problem.id || problem._id)}
                      className="w-100"
                    >
                      Remove Bookmark
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Bookmarks;
