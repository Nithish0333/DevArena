import React, { useState, useEffect } from 'react';
import { Card, Container, Table, Badge, Pagination } from 'react-bootstrap';
import { leaderboardAPI } from '../services/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async (page = 1) => {
    setLoading(true);
    try {
      const response = await leaderboardAPI.getLeaderboard();
      const leaderboardData = response.data.leaderboard || [];
      setLeaderboard(leaderboardData);
      setPagination({
        currentPage: page,
        totalPages: Math.ceil(leaderboardData.length / 50)
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchLeaderboard(page);
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return <Badge bg="warning">1st</Badge>;
    if (rank === 2) return <Badge bg="secondary">2nd</Badge>;
    if (rank === 3) return <Badge bg="danger">3rd</Badge>;
    return <Badge bg="primary">#{rank}</Badge>;
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
        <h1 className="display-4 fw-bold text-white mb-3">Leaderboard</h1>
        <p className="lead text-white-50">
          Top performers in DevArena
        </p>
      </div>

      <Card className="bg-dark text-white">
        <Card.Header>
          <h5 className="mb-0">Global Rankings</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead className="table-dark">
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Points</th>
                <th>Problems Solved</th>
                <th>Badges</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user) => (
                <tr key={user.id || user._id}>
                  <td>
                    {getRankBadge(user.rank)}
                  </td>
                  <td className="fw-bold">
                    {user.username}
                  </td>
                  <td>
                    <span className="text-primary fw-bold">{user.points}</span>
                  </td>
                  <td>
                    {user.solvedProblems}
                  </td>
                  <td>
                    {user.badges.length > 0 ? (
                      <div>
                        {user.badges.slice(0, 3).map((badge, index) => (
                          <Badge key={index} bg="info" className="me-1">
                            {badge}
                          </Badge>
                        ))}
                        {user.badges.length > 3 && (
                          <Badge bg="secondary">+{user.badges.length - 3}</Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted">No badges yet</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

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

export default Leaderboard;
