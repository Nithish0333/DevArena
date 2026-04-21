const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Problem = sequelize.define('Problem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  inputFormat: {
    type: DataTypes.TEXT
  },
  outputFormat: {
    type: DataTypes.TEXT
  },
  constraints: {
    type: DataTypes.TEXT
  },
  sampleInput: {
    type: DataTypes.TEXT
  },
  sampleOutput: {
    type: DataTypes.TEXT
  },
  testCases: {
    type: DataTypes.JSON,
    allowNull: false
  },
  timeLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 5000
  },
  memoryLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 256
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  solvedBy: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Problem;
