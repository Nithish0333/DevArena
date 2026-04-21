const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false
  }
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Arrays', 'Strings', 'Recursion', 'Sorting', 'Searching', 'Dynamic Programming', 'Graphs', 'Trees', 'Linked Lists', 'Stacks', 'Queues', 'Hash Tables', 'Greedy', 'Backtracking', 'Math', 'Bit Manipulation']
  },
  tags: [{
    type: String,
    trim: true
  }],
  inputFormat: {
    type: String,
    required: true
  },
  outputFormat: {
    type: String,
    required: true
  },
  constraints: {
    type: String,
    required: true
  },
  sampleInput: {
    type: String,
    required: true
  },
  sampleOutput: {
    type: String,
    required: true
  },
  testCases: [testCaseSchema],
  solvedBy: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 10
  },
  timeLimit: {
    type: Number,
    default: 1000
  },
  memoryLimit: {
    type: Number,
    default: 256
  }
}, {
  timestamps: true
});

problemSchema.index({ category: 1, difficulty: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Problem', problemSchema);
