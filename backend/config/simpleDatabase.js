const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'devarena.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          points INTEGER DEFAULT 0,
          badges TEXT DEFAULT '[]',
          solvedProblems TEXT DEFAULT '[]',
          dailyStreak INTEGER DEFAULT 0,
          lastLoginDate TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Problems table
      db.run(`
        CREATE TABLE IF NOT EXISTS problems (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          difficulty TEXT NOT NULL,
          category TEXT NOT NULL,
          tags TEXT DEFAULT '[]',
          inputFormat TEXT,
          outputFormat TEXT,
          constraints TEXT,
          sampleInput TEXT,
          sampleOutput TEXT,
          testCases TEXT NOT NULL,
          timeLimit INTEGER DEFAULT 5000,
          memoryLimit INTEGER DEFAULT 256,
          points INTEGER DEFAULT 10,
          solvedBy INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Submissions table
      db.run(`
        CREATE TABLE IF NOT EXISTS submissions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER,
          problemId INTEGER,
          code TEXT NOT NULL,
          language TEXT NOT NULL,
          status TEXT DEFAULT 'Pending',
          output TEXT,
          error TEXT,
          runtime INTEGER DEFAULT 0,
          memory INTEGER DEFAULT 0,
          testCasesPassed INTEGER DEFAULT 0,
          totalTestCases INTEGER NOT NULL,
          points INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users (id),
          FOREIGN KEY (problemId) REFERENCES problems (id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating tables:', err);
          reject(err);
        } else {
          console.log('Database tables created successfully');
          resolve(db);
        }
      });
    });
  });
};

module.exports = { db, initDatabase };
