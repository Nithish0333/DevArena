const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const { User } = req.models;

    const users = await User.findAll({
      attributes: ['id', 'username', 'points', 'solvedProblems', 'badges'],
      order: [
        ['points', 'DESC'],
        ['id', 'ASC'] // Tie breaker
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    const leaderboard = users.map((user, index) => {
      // solvedProblems in Sequelize is a JSON field
      let solvedCount = 0;
      try {
        const solved = typeof user.solvedProblems === 'string' 
          ? JSON.parse(user.solvedProblems) 
          : user.solvedProblems;
        solvedCount = Array.isArray(solved) ? solved.length : 0;
      } catch (e) {
        solvedCount = 0;
      }

      return {
        rank: (page - 1) * limit + index + 1,
        id: user.id,
        username: user.username,
        points: user.points,
        solvedProblems: solvedCount,
        badges: user.badges
      };
    });

    res.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
