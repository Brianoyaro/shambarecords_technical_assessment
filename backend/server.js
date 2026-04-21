const app = require('./app');
const { sequelize } = require('./models');
require('dotenv').config(); // Load environment variables from .env file

const PORT = process.env.PORT || 9000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        
        await sequelize.sync({ alter: true }); // Sync models with the database
        console.log('Database synchronized successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1); // Exit with failure
    }
};

startServer();