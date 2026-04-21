const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const users = await User.find()
      .select('username points solvedProblems badges')
      .sort({ points: -1, 'solvedProblems': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const leaderboard = users.map((user, index) => ({
      rank: (page - 1) * limit + index + 1,
      _id: user._id,
      username: user.username,
      points: user.points,
      solvedProblems: user.solvedProblems.length,
      badges: user.badges
    }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
