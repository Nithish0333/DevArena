const express = require('express');
const { body, validationResult } = require('express-validator');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      difficulty,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const problems = await Problem.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-testCases');

    const total = await Problem.countDocuments(filter);

    res.json({
      problems,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const problemForUser = problem.toObject();
    problemForUser.testCases = problem.testCases.filter(tc => !tc.isHidden);

    res.json(problemForUser);
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

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const submission = new Submission({
      userId: req.user._id,
      problemId,
      code,
      language,
      totalTestCases: problem.testCases.length
    });

    await submission.save();

    const { processSubmission } = require('../controllers/submissionController');
    setImmediate(() => processSubmission(submission._id));

    res.status(201).json({
      message: 'Code submitted successfully',
      submission: {
        _id: submission._id,
        status: submission.status,
        submittedAt: submission.createdAt
      }
    });
  } catch (error) {
    console.error('Submit solution error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const problemId = req.params.id;
    
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user._id);

    if (!user.bookmarkedProblems.includes(problemId)) {
      user.bookmarkedProblems.push(problemId);
      await user.save();
    }

    res.json({ message: 'Problem bookmarked successfully' });
  } catch (error) {
    console.error('Bookmark problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id/bookmark', auth, async (req, res) => {
  try {
    const problemId = req.params.id;
    
    const User = require('../models/User');
    const user = await User.findById(req.user._id);

    user.bookmarkedProblems = user.bookmarkedProblems.filter(
      id => id.toString() !== problemId
    );
    await user.save();

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Problem.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
