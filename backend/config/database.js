const { Sequalize } = require('./sequelize');
require('dotenv').config(); // Load environment variables from .env file

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql', // Change to 'postgres' if using PostgreSQL
        logging: process.env.DB_LOGGING === 'true' ? console.log : false, // Enable logging based on environment variable
        define: {
            timestamps: true, // Automatically add createdAt and updatedAt fields
            underscored: false, // Use camelCase for automatically added fields
        },
    }
);

module.exports = sequelize;