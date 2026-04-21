const Field = require('../models/field');

class FieldRepository {
    async create(fieldData) {
        return await Field.create(fieldData);
    }

    async findAll() {
        return await Field.findAll();
    }

    async findByAgentId(agentId) {
        return await Field.findAll({ where: { assignedAgentId: agentId } });
    }

    async findById(fieldId) {
        return await Field.findByPk(fieldId);
    }

    async update(fieldId, updateData) {
        const field = await this.findById(fieldId);
        if (!field) {
            throw new Error('Field not found');
        }
        return await field.update(updateData);
    }

    async delete(fieldId) {
        const field = await this.findById(fieldId);
        if (!field) {
            throw new Error('Field not found');
        }
        await field.destroy();
    }
}

module.exports = new FieldRepository();
