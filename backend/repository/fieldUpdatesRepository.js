const FieldUpdate = require('../models/fieldUpdate');
const User = require('../models/user');
const AppError = require('../utils/appError');

class FieldUpdatesRepository {
    async create(updateData) {
        return await FieldUpdate.create(updateData);
    }

    async findByFieldId(fieldId) {
        return await FieldUpdate.findAll({ 
            where: { fieldId },
            include: [{ model: User, as: 'agent', attributes: ['id', 'username', 'email'] }]
        });
    }

    async findById(id) {
        return await FieldUpdate.findByPk(id, {
            include: [{ model: User, as: 'agent', attributes: ['id', 'username', 'email'] }]
        });
    }

    async findAll(agentId) {
        const whereClause = agentId ? { agentId } : {};
        return await FieldUpdate.findAll({ 
            where: whereClause,
            include: [{ model: User, as: 'agent', attributes: ['id', 'username', 'email'] }]
        });
    }

    async update(id, updateData) {
        const update = await FieldUpdate.findByPk(id);
        if (!update) {
            throw new AppError('Field update not found', 404);
        }
        return await update.update(updateData);
    }

    async delete(id) {
        const update = await FieldUpdate.findByPk(id);
        if (!update) {
            throw new AppError('Field update not found', 404);
        }
        await update.destroy();
    }
}


module.exports = new FieldUpdatesRepository();