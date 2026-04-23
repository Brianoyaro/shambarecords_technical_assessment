require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize } = require('./models');
const User = require('./models/user');
const Field = require('./models/field');
const FieldUpdate = require('./models/fieldUpdate');

const seedDatabase = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    // Sync models
    await sequelize.sync({ alter: true });
    console.log('✓ Models synchronized');

    // Clear existing data
    await FieldUpdate.destroy({ where: {} });
    await Field.destroy({ where: {} });
    await User.destroy({ where: {} });
    console.log('✓ Cleared existing data');

    // Create users
    const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
    const hashedPasswordAgent1 = await bcrypt.hash('agent123', 10);
    const hashedPasswordAgent2 = await bcrypt.hash('agent123', 10);

    const admin = await User.create({
      email: 'admin@email.com',
      passwordHash: hashedPasswordAdmin,
      username: 'Admin User',
      role: 'admin',
    });

    const agent1 = await User.create({
      email: 'agent1@email.com',
      passwordHash: hashedPasswordAgent1,
      username: 'John Agent',
      role: 'user',
    });

    const agent2 = await User.create({
      email: 'agent2@email.com',
      passwordHash: hashedPasswordAgent2,
      username: 'Jane Agent',
      role: 'user',
    });

    console.log('✓ Created users');
} catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
    console.log('✓ Database connection closed');
  }
};

seedDatabase();