const fieldUpdatesRepository = require('../repository/fieldUpdatesRepository');
const fieldRepository = require('../repository/fieldRepository');
const AppError = require('../utils/appError');
const FieldStageEnum = require('../enums/fieldStagesEnum');

class FieldUpdatesService {
    async createFieldUpdate(fieldId, agentId, notes, fieldStage) {
        if (!Object.values(FieldStageEnum.STAGE).includes(fieldStage)) {
            throw new AppError('Invalid field stage', 400);
        }
        
        // Verify the field exists
        const field = await fieldRepository.findById(fieldId);
        if (!field) {
            throw new AppError('Field not found', 404);
        }
        
        console.log('Creating field update:', { fieldId, agentId, fieldStage, notes });
        
        const newUpdate = await fieldUpdatesRepository.create({
            fieldId,
            agentId,
            notes,
            fieldStage
        });
        
        // Update the field's currentStage to match the update's fieldStage
        console.log('Updating field currentStage to:', fieldStage);
        await fieldRepository.update(fieldId, { currentStage: fieldStage });
        
        return newUpdate;
    }

    async getFieldUpdatesByFieldId(fieldId) {
        const updates = await fieldUpdatesRepository.findByFieldId(fieldId);
        return updates;
    }

    async getAllFieldUpdates(agentId) {
        const updates = await fieldUpdatesRepository.findAll(agentId);
        return updates;
    }

    async updateFieldUpdate(id, userId, notes, fieldStage) {
        if (!Object.values(FieldStageEnum.STAGE).includes(fieldStage)) {
            throw new AppError('Invalid field stage', 400);
        }
        
        // Check if the update exists and if user is the author
        const existingUpdate = await fieldUpdatesRepository.findById(id);
        if (!existingUpdate) {
            throw new AppError('Field update not found', 404);
        }
        
        if (existingUpdate.agentId !== userId) {
            throw new AppError('Only the author can edit this update', 403);
        }
        
        console.log('Updating field update:', { id, fieldStage, notes });
        
        const updatedUpdate = await fieldUpdatesRepository.update(id, { notes, fieldStage });
        
        // If the fieldStage was changed, update the field's currentStage as well
        if (existingUpdate.fieldStage !== fieldStage) {
            console.log('Field stage changed from', existingUpdate.fieldStage, 'to', fieldStage, 'updating field');
            await fieldRepository.update(existingUpdate.fieldId, { currentStage: fieldStage });
        }
        
        return updatedUpdate;
    }

    async deleteFieldUpdate(id, userId) {
        // Check if the update exists and if user is the author
        const existingUpdate = await fieldUpdatesRepository.findById(id);
        if (!existingUpdate) {
            throw new AppError('Field update not found', 404);
        }
        
        if (existingUpdate.agentId !== userId) {
            throw new AppError('Only the author can delete this update', 403);
        }
        
        await fieldUpdatesRepository.delete(id);
    }
}

module.exports = new FieldUpdatesService();