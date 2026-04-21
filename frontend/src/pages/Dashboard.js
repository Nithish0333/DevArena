import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Button, ProgressBar, Container } from 'react-bootstrap';
import { userAPI, problemsAPI } from '../services/api';

const Dashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [recentProblems, setRecentProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, problemsResponse] = await Promise.all([
          userAPI.getStats(),
          problemsAPI.getProblems({ limit: 5 })
        ]);
        
        setUserStats(statsResponse.data);
        setRecentProblems(problemsResponse.data.problems);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-5">
        <h1 className="display-4 fw-bold text-white mb-3">Welcome to DevArena</h1>
        <p className="lead text-white-50">
          Master coding skills through practice and competition
        </p>
      </div>

      {userStats && (
        <Row className="mb-5">
          <Col md={3}>
            <Card className="bg-primary text-white h-100">
              <Card.Body className="text-center">
                <h3 className="mb-2">{userStats.totalSolved}</h3>
                <p className="mb-0">Problems Solved</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="bg-success text-white h-100">
              <Card.Body className="text-center">
                <h3 className="mb-2">{userStats.points}</h3>
                <p className="mb-0">Points Earned</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="bg-warning text-white h-100">
              <Card.Body className="text-center">
                <h3 className="mb-2">{userStats.streak}</h3>
                <p className="mb-0">Day Streak</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="bg-info text-white h-100">
              <Card.Body className="text-center">
                <h3 className="mb-2">{userStats.rank}</h3>
                <p className="mb-0">Global Rank</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row>
        <Col md={8}>
          <Card className="bg-dark text-white">
            <Card.Header>
              <h5 className="mb-0">Recent Problems</h5>
            </Card.Header>
            <Card.Body>
              {recentProblems.length > 0 ? (
                recentProblems.map((problem) => (
                  <div key={problem.id || problem._id} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-secondary">
                    <div>
                      <h6 className="mb-1">
                        <Link to={`/problems/${problem.id || problem._id}`} className="text-white text-decoration-none">
                          {problem.title}
                        </Link>
                      </h6>
                      <small className="text-white-50">
                        {problem.category} • {problem.difficulty}
                      </small>
                    </div>
                    <span className={`badge ${
                      problem.difficulty === 'Easy' ? 'bg-success' :
                      problem.difficulty === 'Medium' ? 'bg-warning' : 'bg-danger'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-white-50">No problems available yet.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="bg-dark text-white mb-4">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button as={Link} to="/problems" variant="primary">
                  Browse Problems
                </Button>
                <Button as={Link} to="/leaderboard" variant="outline-primary">
                  View Leaderboard
                </Button>
                <Button as={Link} to="/profile" variant="outline-primary">
                  Edit Profile
                </Button>
              </div>
            </Card.Body>
          </Card>

          {userStats && userStats.progress && (
            <Card className="bg-dark text-white">
              <Card.Header>
                <h5 className="mb-0">Progress by Category</h5>
              </Card.Header>
              <Card.Body className="p-3">
                <div className="progress-scroll-container custom-scrollbar">
                  {Object.entries(userStats.progress).map(([category, progress]) => (
                    <div key={category} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>{category}</span>
                        <span>{progress.solved}/{progress.total}</span>
                      </div>
                      <ProgressBar 
                        now={(progress.solved / progress.total) * 100} 
                        variant="primary"
                        className="bg-secondary"
                      />
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
