const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth_sqlite');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { difficulty, category, search, page = 1, limit = 10 } = req.query;
    const { Problem } = req.models;
    
    const whereClause = {};
    
    if (difficulty) {
      whereClause.difficulty = difficulty;
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    if (search) {
      whereClause[require('sequelize').Op.or] = [
        { title: { [require('sequelize').Op.like]: `%${search}%` } },
        { description: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows: problems } = await Problem.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });
    
    const categories = await Problem.findAll({
      attributes: [[require('sequelize').fn('DISTINCT', require('sequelize').col('category')), 'category']],
      raw: true
    });
    
    res.json({
      problems,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalProblems: count
      },
      categories: categories.map(c => c.category)
    });
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/categories/list', async (req, res) => {
  try {
    const { Problem } = req.models;
    
    const categories = await Problem.findAll({
      attributes: [[require('sequelize').fn('DISTINCT', require('sequelize').col('category')), 'category']],
      raw: true
    });
    
    res.json(categories.map(c => c.category));
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Problem } = req.models;
    
    const problem = await Problem.findByPk(id);
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    
    res.json(problem);
  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/submit', [
  auth,
  body('code').notEmpty().withMessage('Code is required'),
  body('language').isIn(['javascript', 'python', 'java', 'cpp', 'c']).withMessage('Invalid language')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { code, language } = req.body;
    const problemId = req.params.id;
    const { Problem, Submission } = req.models;

    const problem = await Problem.findByPk(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const submission = await Submission.create({
      userId: req.user.id,
      problemId,
      code,
      language,
      totalTestCases: typeof problem.testCases === 'string' 
        ? JSON.parse(problem.testCases).length 
        : problem.testCases.length
    });

    // Process submission asynchronously
    const { processSubmission } = require('../controllers/submissionController_sqlite');
    setImmediate(() => processSubmission(submission.id));

    res.status(201).json({
      message: 'Code submitted successfully',
      submission: {
        id: submission.id,
        status: submission.status,
        createdAt: submission.createdAt
      }
    });
  } catch (error) {
    console.error('Submit solution error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const problemId = parseInt(req.params.id);
    const { User } = req.models;
    const user = await User.findByPk(req.user.id);

    let bookmarks = [];
    try {
      const rawBookmarks = user.bookmarkedProblems;
      bookmarks = typeof rawBookmarks === 'string' 
        ? JSON.parse(rawBookmarks) 
        : (Array.isArray(rawBookmarks) ? rawBookmarks : []);
    } catch (e) {
      bookmarks = [];
    }

    if (!bookmarks.includes(problemId)) {
      // Use spread to create a new array reference so Sequelize detects the change
      user.bookmarkedProblems = [...bookmarks, problemId];
      await user.save();
      console.log(`Problem ${problemId} bookmarked for user ${user.id}`);
    }

    res.json({ message: 'Problem bookmarked successfully', bookmarks: user.bookmarkedProblems });
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id/bookmark', auth, async (req, res) => {
  try {
    const problemId = parseInt(req.params.id);
    const { User } = req.models;
    const user = await User.findByPk(req.user.id);

    let bookmarks = [];
    try {
      const rawBookmarks = user.bookmarkedProblems;
      bookmarks = typeof rawBookmarks === 'string' 
        ? JSON.parse(rawBookmarks) 
        : (Array.isArray(rawBookmarks) ? rawBookmarks : []);
    } catch (e) {
      bookmarks = [];
    }

    const index = bookmarks.indexOf(problemId);
    if (index !== -1) {
      const newBookmarks = bookmarks.filter(id => id !== problemId);
      user.bookmarkedProblems = newBookmarks;
      await user.save();
      console.log(`Problem ${problemId} unbookmarked for user ${user.id}`);
    }

    res.json({ message: 'Bookmark removed successfully', bookmarks: user.bookmarkedProblems });
  } catch (error) {
    console.error('Unbookmark error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
