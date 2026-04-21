import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { authAPI } from '../services/api';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getCurrentUser()
        .then(response => setUser(response.data.user))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        });
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          <strong>DevArena</strong>
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className={location.pathname === '/' ? 'active' : ''}>
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/problems" className={location.pathname === '/problems' ? 'active' : ''}>
              Problems
            </Nav.Link>
            <Nav.Link as={Link} to="/leaderboard" className={location.pathname === '/leaderboard' ? 'active' : ''}>
              Leaderboard
            </Nav.Link>
            <Nav.Link as={Link} to="/practice" className={location.pathname === '/practice' ? 'active' : ''}>
              Practice
            </Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link as={Link} to="/bookmarks">
                  Bookmarks
                </Nav.Link>
                <Nav.Link as={Link} to="/submissions">
                  Submissions
                </Nav.Link>
                <NavDropdown title={user.username} id="user-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className={location.pathname === '/register' ? 'active' : ''}>
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
