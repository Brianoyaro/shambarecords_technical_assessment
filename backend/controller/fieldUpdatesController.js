const fieldUpdatesService = require('../service/fieldUpdatesService');

class FieldUpdatesController {
    async createFieldUpdate(req, res, next) {
        try {
            const { fieldId } = req.params;
            const { notes, fieldStage } = req.body;
            const agentId = req.user.id; // Get the agent ID from the authenticated user

            const response = await fieldUpdatesService.createFieldUpdate(fieldId, agentId, notes, fieldStage);
            res.status(201).json({
                message: 'Field update created successfully',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    async getFieldUpdates(req, res, next) {
        try {
            const { fieldId } = req.params;
            const response = await fieldUpdatesService.getFieldUpdatesByFieldId(fieldId);
            res.status(200).json({
                message: 'Field updates retrieved successfully',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }
    // ADMIN
    async getAllFieldUpdates(req, res, next) {
        try {
            const { fieldAgentId } = req.query; // Optional filter by agent ID
            const response = await fieldUpdatesService.getAllFieldUpdates(fieldAgentId);
            res.status(200).json({
                message: 'All field updates retrieved successfully',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }
    // update (only author can update)
    async updateFieldUpdate(req, res, next) {
        try {
            const { id } = req.params;
            const { notes, fieldStage } = req.body;
            const userId = req.user.id;

            const response = await fieldUpdatesService.updateFieldUpdate(id, userId, notes, fieldStage);
            res.status(200).json({
                message: 'Field update updated successfully',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }
    // delete an update (only author can delete)
    async deleteFieldUpdate(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            await fieldUpdatesService.deleteFieldUpdate(id, userId);
            res.status(200).json({
                message: 'Field update deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new FieldUpdatesController();