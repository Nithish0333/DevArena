const { initDatabase } = require('./config/initDatabase');
require('dotenv').config();

const checkUsers = async () => {
  try {
    const { User } = await initDatabase();
    const users = await User.findAll();
    console.log(`Found ${users.length} users:`);
    users.forEach(u => {
      console.log(`- ${u.username} (${u.email})`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
};

checkUsers();
