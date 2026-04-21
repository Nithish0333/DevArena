const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { db, initDatabase } = require('./config/simpleDatabase');
const authRoutes = require('./routes/auth_simple');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize database
const initializeApp = async () => {
  try {
    await initDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

// Make database available to routes
app.use((req, res, next) => {
  req.models = { db };
  next();
});

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), database: 'SQLite (simple)' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await initializeApp();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database: SQLite (simple)`);
  });
};

startServer();
