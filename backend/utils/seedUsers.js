const { initDatabase } = require('../config/initDatabase');

const sampleUsers = [
  {
    username: "code_master",
    email: "master@example.com",
    password: "password123",
    points: 1250,
    badges: ["Top 10", "First Solve", "10 Problems"],
    solvedProblems: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    dailyStreak: 15
  },
  {
    username: "algo_expert",
    email: "algo@example.com",
    password: "password123",
    points: 980,
    badges: ["First Solve", "10 Problems"],
    solvedProblems: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
    dailyStreak: 5
  },
  {
    username: "dev_ninja",
    email: "ninja@example.com",
    password: "password123",
    points: 850,
    badges: ["First Solve"],
    solvedProblems: [2, 4, 6, 8, 10, 12, 14, 16],
    dailyStreak: 8
  },
  {
    username: "python_pro",
    email: "python@example.com",
    password: "password123",
    points: 720,
    badges: ["First Solve"],
    solvedProblems: [1, 2, 5, 10, 15, 20],
    dailyStreak: 3
  },
  {
    username: "js_wizard",
    email: "js@example.com",
    password: "password123",
    points: 600,
    badges: ["First Solve"],
    solvedProblems: [3, 6, 9, 12, 15],
    dailyStreak: 12
  },
  {
    username: "rust_lover",
    email: "rust@example.com",
    password: "password123",
    points: 540,
    badges: ["First Solve"],
    solvedProblems: [1, 4, 7, 10],
    dailyStreak: 2
  },
  {
    username: "cpp_guru",
    email: "cpp@example.com",
    password: "password123",
    points: 480,
    badges: ["First Solve"],
    solvedProblems: [2, 5, 8],
    dailyStreak: 1
  },
  {
    username: "java_star",
    email: "java@example.com",
    password: "password123",
    points: 410,
    badges: ["First Solve"],
    solvedProblems: [1, 10, 20],
    dailyStreak: 10
  },
  {
    username: "newbie_coder",
    email: "newbie@example.com",
    password: "password123",
    points: 150,
    badges: ["First Solve"],
    solvedProblems: [1],
    dailyStreak: 4
  },
  {
    username: "bug_hunter",
    email: "bug@example.com",
    password: "password123",
    points: 320,
    badges: ["First Solve"],
    solvedProblems: [2, 3],
    dailyStreak: 6
  }
];

const seedUsers = async () => {
  try {
    const { User } = await initDatabase();
    
    // Check if users already exist to avoid unique constraint errors
    for (const userData of sampleUsers) {
      const existingUser = await User.findOne({ where: { username: userData.username } });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Created user: ${userData.username}`);
      } else {
        console.log(`User ${userData.username} already exists, skipping...`);
      }
    }
    
    console.log('User seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
