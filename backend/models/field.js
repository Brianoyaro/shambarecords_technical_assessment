const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FieldStagesEnum = require('../enums/fieldStagesEnum');

const Field = sequelize.define('Field', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cropType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    size: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Field size in acres',
    },
    plantingDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    currentStage: {
        type: DataTypes.ENUM(...Object.values(FieldStagesEnum.STAGE)),
        allowNull: false,
        defaultValue: FieldStagesEnum.STAGE.PLANTED, // Default stage is 'planted'
    },
    // relationship with the user
    assignedAgentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // name of the target table
            key: 'id', // key in the target table that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    tableName: 'fields',
});

module.exports = Field;