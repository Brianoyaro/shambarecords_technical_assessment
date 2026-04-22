const { fieldUpdatesRepository } = require('../repository/fieldUpdatesRepository');
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

    async updateFieldUpdate(id, notes, fieldStage) {
        if (!Object.values(FieldStageEnum.STAGE).includes(fieldStage)) {
            throw new AppError('Invalid field stage', 400);
        }
        const updatedUpdate = await fieldUpdatesRepository.update(id, { notes, fieldStage });
        return updatedUpdate;
    }

    async deleteFieldUpdate(id) {
        await fieldUpdatesRepository.delete(id);
    }
}

module.exports = new FieldUpdatesService();