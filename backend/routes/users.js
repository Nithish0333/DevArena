const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('solvedProblems', 'title difficulty category points')
      .populate('bookmarkedProblems', 'title difficulty category');

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', [
  auth,
  body('username').optional().trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { username, email } = req.body;
    const updateData = {};

    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      updateData.username = username;
    }

    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already taken' });
      }
      updateData.email = email;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/submissions', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, problemId } = req.query;

    const filter = { userId: req.user._id };
    
    if (status) {
      filter.status = status;
    }
    
    if (problemId) {
      filter.problemId = problemId;
    }

    const submissions = await Submission.find(filter)
      .populate('problemId', 'title difficulty')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Submission.countDocuments(filter);

    res.json({
      submissions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/bookmarks', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'bookmarkedProblems',
        select: 'title difficulty category points solvedBy'
      });

    res.json({ bookmarks: user.bookmarkedProblems });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('solvedProblems');

    const submissions = await Submission.find({ userId: req.user._id });

    const categoryStats = {};
    const categories = await Problem.distinct('category');

    for (const category of categories) {
      const totalInCategory = await Problem.countDocuments({ category });
      const solvedInCategory = user.solvedProblems.filter(
        problem => problem.category === category
      ).length;

      categoryStats[category] = {
        total: totalInCategory,
        solved: solvedInCategory
      };
    }

    const stats = {
      totalSolved: user.solvedProblems.length,
      points: user.points,
      streak: user.streak,
      rank: user.rank,
      totalSubmissions: submissions.length,
      acceptedSubmissions: submissions.filter(s => s.status === 'Accepted').length,
      progress: categoryStats
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
