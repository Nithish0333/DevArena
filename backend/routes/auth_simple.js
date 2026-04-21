const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

router.post('/register', [
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
    const { db } = req.models;

    // Check if user already exists
    db.get(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username],
      async (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        if (row) {
          return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        db.run(
          'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
          [username, email, hashedPassword],
          function(err) {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ message: 'Server error' });
            }

            const token = generateToken(this.lastID);

            res.status(201).json({
              message: 'User registered successfully',
              token,
              user: {
                id: this.lastID,
                username,
                email,
                points: 0,
                badges: []
              }
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    const { db } = req.models;

    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Server error' });
        }

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
          
          let newStreak = 1;
          if (lastLogin === yesterday.toDateString()) {
            newStreak = user.dailyStreak + 1;
          }
          
          db.run(
            'UPDATE users SET dailyStreak = ?, lastLoginDate = ? WHERE id = ?',
            [newStreak, new Date().toISOString(), user.id]
          );
          
          user.dailyStreak = newStreak;
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
            badges: JSON.parse(user.badges || '[]'),
            solvedProblems: JSON.parse(user.solvedProblems || '[]'),
            dailyStreak: user.dailyStreak
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { db } = req.models;

    db.get(
      'SELECT id, username, email, points, badges, solvedProblems, dailyStreak FROM users WHERE id = ?',
      [decoded.userId],
      (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        if (!user) {
          return res.status(401).json({ message: 'Token is not valid' });
        }

        res.json({
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            points: user.points,
            badges: JSON.parse(user.badges || '[]'),
            solvedProblems: JSON.parse(user.solvedProblems || '[]'),
            dailyStreak: user.dailyStreak
          }
        });
      }
    );
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
});

module.exports = router;
