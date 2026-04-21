import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import Practice from './pages/Practice';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Bookmarks from './pages/Bookmarks';
import SubmissionHistory from './pages/SubmissionHistory';
import './App.css';

// Component to handle layout and auth logic
const Layout = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // If no token and not on an auth page, redirect to login
  if (!token && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  // If token exists and on an auth page, redirect to dashboard
  if (token && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {token && <Navbar />}
      <main className={token ? "main-content" : "auth-content"}>
        {children}
      </main>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/submissions" element={<SubmissionHistory />} />
            {/* Catch-all route to redirect back to dashboard/login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
