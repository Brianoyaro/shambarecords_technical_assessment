const { fieldUpdatesService } = require('../service/fieldUpdatesService');

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
    // update
    async updateFieldUpdate(req, res, next) {
        try {
            const { id } = req.params;
            const { notes, fieldStage } = req.body;

            const response = await fieldUpdatesService.updateFieldUpdate(id, notes, fieldStage);
            res.status(200).json({
                message: 'Field update updated successfully',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }
    // delete an update
    async deleteFieldUpdate(req, res, next) {
        try {
            const { id } = req.params;

            await fieldUpdatesService.deleteFieldUpdate(id);
            res.status(200).json({
                message: 'Field update deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new FieldUpdatesController();