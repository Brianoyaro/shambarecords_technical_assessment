const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const USERENUM = require('../enums/userRoleEnum');

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
        type: DataTypes.ENUM(...Object.values(USERENUM.ROLE)),
        allowNull: false,
        defaultValue: USERENUM.ROLE.USER, // Default role is 'user'
    },
    status: {
        type: DataTypes.ENUM(...Object.values(USERENUM.STATUS)),
        allowNull: false,
        defaultValue: USERENUM.STATUS.ACTIVE, // Default status is 'active'
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