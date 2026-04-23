const sequelize = require('../config/database');
const User = require('./user');
const Field = require('./field');
const FieldUpdate = require('./fieldUpdate');

// Define relations
User.hasMany(Field, { foreignKey: 'assignedAgentId', as: 'assignedFields' });
Field.belongsTo(User, { foreignKey: 'assignedAgentId', as: 'assignedAgent' });

User.hasMany(FieldUpdate, { foreignKey: 'agentId', as: 'fieldUpdates' });
FieldUpdate.belongsTo(User, { foreignKey: 'agentId', as: 'agent' });

Field.hasMany(FieldUpdate, { foreignKey: 'fieldId', as: 'updates' });
FieldUpdate.belongsTo(Field, { foreignKey: 'fieldId', as: 'field' });

module.exports = {
    sequelize,
};