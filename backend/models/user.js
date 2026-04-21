const { DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize; // Import the Sequelize instance
// const sequelize = require('../config/database');
const USER_ENUM = require('../enums/userEnum');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM(...Object.values(USER_ENUM.ROLE)),
        allowNull: false,
        defaultValue: USER_ENUM.ROLE.USER, // Default role is 'user'
    },
    status: {
        type: DataTypes.ENUM(...Object.values(USER_ENUM.STATUS)),
        allowNull: false,
        defaultValue: USER_ENUM.STATUS.ACTIVE, // Default status is 'active'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    tableName: 'users',
});

module.exports = User;