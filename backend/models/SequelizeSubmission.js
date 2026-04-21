const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  problemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Problems',
      key: 'id'
    }
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  language: {
    type: DataTypes.ENUM('javascript', 'python', 'java', 'cpp', 'c'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Runtime Error', 'Compilation Error'),
    defaultValue: 'Pending'
  },
  output: {
    type: DataTypes.TEXT
  },
  error: {
    type: DataTypes.TEXT
  },
  runtime: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  memory: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  testCasesPassed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalTestCases: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Submission;
