const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory storage for testing (replace with proper database later)
const users = [];
let userIdCounter = 1;

// Middleware to extract user from token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = users.find(u => u.id === decoded.userId) || null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), database: 'Memory' });
});

// Auth routes
app.post('/api/auth/register', [
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      id: userIdCounter++,
      username,
      email,
      password: hashedPassword,
      points: 0,
      badges: [],
      solvedProblems: [],
      dailyStreak: 0,
      lastLoginDate: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);

    const token = generateToken(newUser.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        points: newUser.points,
        badges: newUser.badges
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update daily streak
    const today = new Date().toDateString();
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate).toDateString() : null;
    
    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastLogin === yesterday.toDateString()) {
        user.dailyStreak += 1;
      } else {
        user.dailyStreak = 1;
      }
      
      user.lastLoginDate = new Date();
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        points: user.points,
        badges: user.badges,
        solvedProblems: user.solvedProblems,
        dailyStreak: user.dailyStreak
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Token is not valid' });
  }

  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      points: req.user.points,
      badges: req.user.badges,
      solvedProblems: req.user.solvedProblems,
      dailyStreak: req.user.dailyStreak
    }
  });
});

// Sample problems data
const problems = [
  {
    id: 1,
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Easy",
    category: "Arrays",
    tags: ["array", "hash-table"],
    inputFormat: "First line contains an integer n (size of array). Second line contains n space-separated integers. Third line contains the target integer.",
    outputFormat: "Print two space-separated indices (0-based) of the numbers that add up to the target.",
    constraints: "2 <= nums.length <= 10^4",
    sampleInput: "4\n2 7 11 15\n9",
    sampleOutput: "0 1",
    testCases: [
      { input: "4\n2 7 11 15\n9", expectedOutput: "0 1", isHidden: false },
      { input: "3\n3 2 4\n6", expectedOutput: "0 1", isHidden: false }
    ],
    points: 10,
    solvedBy: 0
  },
  {
    id: 2,
    title: "Palindrome Number",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    difficulty: "Easy",
    category: "Math",
    tags: ["math"],
    inputFormat: "A single integer x.",
    outputFormat: "Print 'true' if x is a palindrome, otherwise print 'false'.",
    constraints: "-2^31 <= x <= 2^31 - 1",
    sampleInput: "121",
    sampleOutput: "true",
    testCases: [
      { input: "121", expectedOutput: "true", isHidden: false },
      { input: "-121", expectedOutput: "false", isHidden: false }
    ],
    points: 10,
    solvedBy: 0
  }
];

// Problems routes
app.get('/api/problems', (req, res) => {
  const { difficulty, category, search, page = 1, limit = 10 } = req.query;
  
  let filteredProblems = problems;
  
  if (difficulty) {
    filteredProblems = filteredProblems.filter(p => p.difficulty === difficulty);
  }
  
  if (category) {
    filteredProblems = filteredProblems.filter(p => p.category === category);
  }
  
  if (search) {
    filteredProblems = filteredProblems.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  const categories = [...new Set(problems.map(p => p.category))];
  
  res.json({
    problems: filteredProblems,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(filteredProblems.length / limit),
      totalProblems: filteredProblems.length
    },
    categories
  });
});

app.get('/api/problems/categories/list', (req, res) => {
  const categories = [...new Set(problems.map(p => p.category))];
  res.json(categories);
});

app.get('/api/problems/:id', (req, res) => {
  const problem = problems.find(p => p.id === parseInt(req.params.id));
  
  if (!problem) {
    return res.status(404).json({ message: 'Problem not found' });
  }
  
  res.json(problem);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database: In-Memory (for testing)`);
  console.log(`Available routes:`);
  console.log(`  POST /api/auth/register - Register user`);
  console.log(`  POST /api/auth/login - Login user`);
  console.log(`  GET /api/auth/me - Get current user`);
  console.log(`  GET /api/problems - Get problems list`);
  console.log(`  GET /api/problems/:id - Get problem by ID`);
});
