const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Backend is running'
  });
});

// Basic registration endpoint
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Mock successful registration
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: 1,
        username,
        email,
        points: 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Basic login endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Mock successful login
    res.json({
      message: 'Login successful',
      token: 'mock-jwt-token',
      user: {
        id: 1,
        username: 'testuser',
        email,
        points: 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Problems endpoint
app.get('/api/problems', (req, res) => {
  res.json([
    {
      id: 1,
      title: "Two Sum",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      difficulty: "Easy",
      category: "Arrays",
      points: 10
    },
    {
      id: 2,
      title: "Palindrome Number",
      description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
      difficulty: "Easy",
      category: "Math",
      points: 10
    }
  ]);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
