const authService = require('../service/authService');

class AuthController {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            const response = await authService.register(username, email, password);
            res.status(201).json({
                 message: 'User registered successfully', 
                 data: response 
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const response = await authService.login(email, password);
            res.status(200).json({
                message: 'Login successful',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    async registerAdmin(req, res, next) {
        try {
            const { username, email, password } = req.body;
            const response = await authService.registerAdmin(username, email, password);
            res.status(201).json({
                message: 'Admin user registered successfully',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    async deactivateUser(req, res, next) {
        try {
            const userId = req.params.id;
            const response = await authService.deactivateUser(userId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async activateUser(req, res, next) {
        try {
            const userId = req.params.id;
            const response = await authService.activateUser(userId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
    async getAllUsers(req, res, next) {
        try {
            const users = await authService.getAllUsers();
            res.status(200).json({
                message: 'Users retrieved successfully',
                data: users
            });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new AuthController();