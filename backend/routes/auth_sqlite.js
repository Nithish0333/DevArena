const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
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
    const { User } = req.models;

    const existingUser = await User.findOne({
      where: {
        [Sequelize.Op.or]: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    const user = await User.create({
      username,
      email,
      password
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        points: user.points,
        badges: user.badges
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Login validation errors:', errors.array());
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    const { User } = req.models;

    console.log(`Login attempt for email: ${email}`);
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    console.log(`Password match for ${email}: ${isMatch}`);

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
      await user.save();
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
        dailyStreak: user.dailyStreak
      }
    });
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
    const { User } = req.models;

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    res.json({
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
    console.error('Get user error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
});

module.exports = router;
