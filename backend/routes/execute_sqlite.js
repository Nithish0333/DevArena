const express = require('express');
const { body, validationResult } = require('express-validator');
const CodeExecutor = require('../utils/codeExecutor');
const router = express.Router();

const codeExecutor = new CodeExecutor();

router.post('/', [
  body('code').notEmpty().withMessage('Code is required'),
  body('language').isIn(['javascript', 'python', 'java', 'cpp', 'c']).withMessage('Invalid language')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, output: errors.array()[0].msg });
    }

    const { code, language, input = '' } = req.body;

    console.log(`Executing ${language} code...`);
    
    // For "Run Code", we use the real system executor
    const result = await codeExecutor.executeCode(code, language, input);

    if (result.status === 'Accepted') {
      res.json({
        success: true,
        output: result.output || 'Code executed successfully (no output)'
      });
    } else {
      res.json({
        success: false,
        output: result.error || result.status || 'Execution failed'
      });
    }
  } catch (error) {
    console.error('Execute code error:', error);
    res.status(500).json({ success: false, output: 'Server error during execution' });
  }
});

module.exports = router;
