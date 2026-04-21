const { sequelize } = require('./config/initDatabase');

const fixSchema = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    const [results] = await sequelize.query("PRAGMA table_info(users)");
    const columnExists = results.some(column => column.name === 'bookmarked_problems');

    if (!columnExists) {
      console.log('Adding bookmarked_problems column to users table...');
      await sequelize.query("ALTER TABLE users ADD COLUMN bookmarked_problems JSON DEFAULT '[]'");
      console.log('Column added successfully.');
    } else {
      console.log('Column bookmarked_problems already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error fixing schema:', error);
    process.exit(1);
  }
};

fixSchema();
