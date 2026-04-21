const sequelize = require('../config/database');
const User = require('./user');
const Field = require('./field');

// Define relations
User.hasMany(Field, { foreignKey: 'assignedAgentId', as: 'assignedFields' });
Field.belongsTo(User, { foreignKey: 'assignedAgentId', as: 'assignedAgent' });



module.exports = {
    sequelize,
};