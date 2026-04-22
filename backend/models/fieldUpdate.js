const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FieldStagesEnum = require('../enums/fieldStagesEnum');

const FieldUpdate = sequelize.define('FieldUpdate', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fieldId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'fields', // name of the target table
            key: 'id', // key in the target table that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    agentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // name of the target table
            key: 'id', // key in the target table that we're referencing
        },
    },
   notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    fieldStage: {
        type: DataTypes.ENUM(...Object.values(FieldStagesEnum.STAGE)),
        allowNull: false,
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
    tableName: 'field_updates',
});

module.exports = FieldUpdate;