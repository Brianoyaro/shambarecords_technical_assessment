const express = require('express');
const authController = require('../controller/authController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const UserEnum = require('../enums/userEnum');

const router = express.Router();
router.use(authMiddleware); // Apply authentication middleware to all routes

// Admin-specific endpoints
router.post('/register', authorize(UserEnum.ROLE.ADMIN), (req, res, next) => authController.registerAdmin(req, res, next));
router.put('/deactivate/:id', authorize(UserEnum.ROLE.ADMIN), (req, res, next) => authController.deactivateUser(req, res, next));
router.put('/activate/:id', authorize(UserEnum.ROLE.ADMIN), (req, res, next) => authController.activateUser(req, res, next));
router.get('/users', authorize(UserEnum.ROLE.ADMIN), (req, res, next) => authController.getAllUsers(req, res, next));
router.delete('/delete/:id', authorize(UserEnum.ROLE.ADMIN), (req, res, next) => authController.deleteUser(req, res, next));

router.get('/test-admin', authorize(UserEnum.ROLE.ADMIN), (req, res, next) => authController.testAdminEndpoint(req, res, next));

module.exports = router;