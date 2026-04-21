const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp', 'c']
  },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error', 'Pending'],
    default: 'Pending'
  },
  output: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  runtime: {
    type: Number,
    default: 0
  },
  memory: {
    type: Number,
    default: 0
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  totalTestCases: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

submissionSchema.index({ userId: 1, createdAt: -1 });
submissionSchema.index({ problemId: 1, status: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
