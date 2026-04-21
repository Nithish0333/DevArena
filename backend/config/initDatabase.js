const sequelize = require('./database');
const User = require('../models/SequelizeUser');
const Problem = require('../models/SequelizeProblem');
const Submission = require('../models/SequelizeSubmission');

// Define associations
User.hasMany(Submission, { foreignKey: 'userId' });
Submission.belongsTo(User, { foreignKey: 'userId' });

Problem.hasMany(Submission, { foreignKey: 'problemId' });
Submission.belongsTo(Problem, { foreignKey: 'problemId' });

const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite connection has been established successfully.');
    
    await sequelize.sync({ force: false });
    console.log('Database & tables created!');
    
    return { User, Problem, Submission };
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { initDatabase, sequelize, User, Problem, Submission };
