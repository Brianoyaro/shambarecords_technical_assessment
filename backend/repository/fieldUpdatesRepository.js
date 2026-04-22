const FieldUpdate = require('../models/fieldUpdate');
const AppError = require('../utils/appError');

class FieldUpdatesRepository {
    async create(updateData) {
        return await FieldUpdate.create(updateData);
    }

    async findByFieldId(fieldId) {
        return await FieldUpdate.findAll({ where: { fieldId } });
    }

    async findAll(agentId) {
        const whereClause = agentId ? { agentId } : {};
        return await FieldUpdate.findAll({ where: whereClause });
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