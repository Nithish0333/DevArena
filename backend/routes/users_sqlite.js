const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth_sqlite');
const { Sequelize } = require('sequelize');

const router = express.Router();

router.get('/profile', auth, async (req, res) => {
  try {
    const { User } = req.models;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

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
    const { User } = req.models;
    const user = await User.findByPk(req.user.id);

    if (username) {
      const existingUser = await User.findOne({ 
        where: { 
          username, 
          id: { [Sequelize.Op.ne]: req.user.id } 
        } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }

    if (email) {
      const existingUser = await User.findOne({ 
        where: { 
          email, 
          id: { [Sequelize.Op.ne]: req.user.id } 
        } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already taken' });
      }
      user.email = email;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/submissions', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, problemId } = req.query;
    const { Submission, Problem } = req.models;

    const where = { userId: req.user.id };
    if (status) where.status = status;
    if (problemId) where.problemId = problemId;

    const { count, rows } = await Submission.findAndCountAll({
      where,
      include: [{ model: Problem, attributes: ['title', 'difficulty'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      submissions: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/bookmarks', auth, async (req, res) => {
  try {
    const { User, Problem } = req.models;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let bookmarkedIds = [];
    try {
      const rawBookmarks = user.bookmarkedProblems;
      bookmarkedIds = typeof rawBookmarks === 'string' 
        ? JSON.parse(rawBookmarks) 
        : (Array.isArray(rawBookmarks) ? rawBookmarks : []);
    } catch (e) {
      console.error('Error parsing bookmarks:', e);
      bookmarkedIds = [];
    }

    console.log(`Fetching bookmarks for user ${user.id}:`, bookmarkedIds);

    if (bookmarkedIds.length === 0) {
      return res.json({ bookmarks: [] });
    }

    const bookmarks = await Problem.findAll({
      where: {
        id: bookmarkedIds
      },
      attributes: ['id', 'title', 'difficulty', 'category', 'points', 'solvedBy']
    });

    res.json({ bookmarks });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const { User, Problem, Submission } = req.models;
    const user = await User.findByPk(req.user.id);

    const submissions = await Submission.findAll({ where: { userId: req.user.id } });
    const problems = await Problem.findAll();
    
    const categoryStats = {};
    const categories = [...new Set(problems.map(p => p.category))];

    // Get solved problems IDs
    const solvedSubmissions = await Submission.findAll({
      where: { userId: req.user.id, status: 'Accepted' },
      attributes: ['problemId'],
      group: ['problemId']
    });
    const solvedProblemIds = solvedSubmissions.map(s => s.problemId);

    for (const category of categories) {
      const problemsInCategory = problems.filter(p => p.category === category);
      const totalInCategory = problemsInCategory.length;
      const solvedInCategory = problemsInCategory.filter(p => solvedProblemIds.includes(p.id)).length;

      categoryStats[category] = {
        total: totalInCategory,
        solved: solvedInCategory
      };
    }

    const stats = {
      totalSolved: solvedProblemIds.length,
      points: user.points,
      streak: user.dailyStreak,
      rank: 1, // Placeholder
      totalSubmissions: submissions.length,
      acceptedSubmissions: solvedProblemIds.length,
      progress: categoryStats
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
