const AppError = require('../utils/appError');
const { fieldRepository } = require('../repository/fieldRepository');
const UserEnum = require('../enums/userEnum');

class FieldService {
    async createField(name, plantingDate, cropType, assignedAgentId) {
        // Validate input data
        if (!name || !plantingDate || !cropType) {
            throw new AppError('Missing required field data', 400);
        }

        const newField = await fieldRepository.create({
            name,
            plantingDate,
            cropType,
            assignedAgentId
        });

        return newField;
    }

    async getAllFields() {
        // Admins only
        return await fieldRepository.findAll();
    }

    async getFieldsByAgentId(agentId) {
        // Retrieve all fields assigned to a specific agent
        return await fieldRepository.findByAgentId(agentId);
    }

    async getFieldById(fieldId, userId, userRole) {
        // get a single field by its PK, with access control based on user role
        const field = await fieldRepository.findById(fieldId);
        if (!field) {
            throw new AppError('Field not found', 404);
        }

        // Admin can access any field, agents can only access their assigned fields
        if (userRole !== UserEnum.ROLE.ADMIN && field.assignedAgentId !== userId) {
            throw new AppError('Access denied. Insufficient permissions', 403);
        }

        return field;
    }

    async updateField(fieldId, updateData) {
        // Admins have this functionality of total field update
        const field = await fieldRepository.findById(fieldId);
        if (!field) {
            throw new AppError('Field not found', 404);
        }
        try {
            const updatedField = await fieldRepository.update(fieldId, updateData);
            return updatedField;
        } catch (error) {
            throw new AppError('Failed to update field', 500);
        }
    }
    async deleteField(fieldId) {
        // admin has this functionality of total field delete, agents have no delete functionality
        const field = await fieldRepository.findById(fieldId);
        if (!field) {
            throw new AppError('Field not found', 404);
        }
        try {
            await fieldRepository.delete(fieldId);
            return { message: 'Field deleted successfully' };
        } catch (error) {
            throw new AppError('Failed to delete field', 500);
        }
    }
}

module.exports = new FieldService();
