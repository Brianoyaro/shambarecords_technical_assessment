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
}

module.exports = new AuthController();