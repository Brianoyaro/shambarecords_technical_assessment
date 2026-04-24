const User = require('../models/user');
const fieldService = require('../service/fieldService');
const  UserEnum  = require('../enums/userEnum');

class FieldController {
    async createField(req, res, next) {
        try {
            // name, plantingDate, cropType, location, size, assignedAgentId
            const { name, plantingDate, cropType, location, size, assignedAgentId } = req.body;
            const response = await fieldService.createField(name, plantingDate, cropType, location, size, assignedAgentId);
            // status should be calculated separately based on plantingDate and current date, not provided by client
            res.status(201).json({
                message: 'Field created successfully',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllFields(req, res, next) {
        try {
            // const user_role = req.user.role;
            let response;
            if (req.user.role === UserEnum.ROLE.ADMIN) {
                // Admin can see all fields, agents can only see their assigned fields
                response = await fieldService.getAllFields();
            } else {
                response = await fieldService.getFieldsByAgentId(req.user.id);
            }
            res.status(200).json({
                message: 'Fields retrieved successfully',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }
    async getFieldById(req, res, next) {
        try {
            const fieldId = req.params.id;
            const userId = req.user.id;
            const userRole = req.user.role;

            // Admin can access any field, agents can only access their assigned fields
            const response = await fieldService.getFieldById(fieldId, userId, userRole);
            res.status(200).json({
                message: 'Field retrieved successfully',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }
    async updateField(req, res, next) {
        // Admin only
        try {
            const fieldId = req.params.id;
            const updateData = req.body;
            const response = await fieldService.updateField(fieldId, updateData);
            res.status(200).json({
                message: 'Field updated successfully',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }
    async deleteField(req, res, next) {
        // Admin only
        try {
            const fieldId = req.params.id;
            const response = await fieldService.deleteField(fieldId);
            res.status(200).json({
                message: 'Field deleted successfully',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    async getFieldsByAgentId(req, res, next) {
        // Agent endpoint - get fields assigned to current user
        try {
            const agentId = req.user.id;
            const response = await fieldService.getFieldsByAgentId(agentId);
            res.status(200).json({
                message: 'Agent fields retrieved successfully',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new FieldController();