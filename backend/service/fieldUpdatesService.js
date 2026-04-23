const fieldUpdatesRepository = require('../repository/fieldUpdatesRepository');
const AppError = require('../utils/appError');
const FieldStageEnum = require('../enums/fieldStagesEnum');

class FieldUpdatesService {
    async createFieldUpdate(fieldId, agentId, notes, fieldStage) {
        if (!Object.values(FieldStageEnum.STAGE).includes(fieldStage)) {
            throw new AppError('Invalid field stage', 400);
        }
        
        const newUpdate = await fieldUpdatesRepository.create({
            fieldId,
            agentId,
            notes,
            fieldStage
        });
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
        
        const updatedUpdate = await fieldUpdatesRepository.update(id, { notes, fieldStage });
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