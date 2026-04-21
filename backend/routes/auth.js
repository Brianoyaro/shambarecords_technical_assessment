const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

// Registration endpoint
router.post('/register', (req, res, next) => authController.register(req, res, next));

// Login endpoint
router.post('/login', (req, res, next) => authController.login(req, res, next));

// Admin-specific endpoints
router.post('/admin/register', (req, res, next) => authController.registerAdmin(req, res, next));
router.put('/admin/deactivate/:id', (req, res, next) => authController.deactivateUser(req, res, next));
router.put('/admin/activate/:id', (req, res, next) => authController.activateUser(req, res, next));
router.get('/admin/users', (req, res, next) => authController.getAllUsers(req, res, next));
router.delete('/admin/delete/:id', (req, res, next) => authController.deleteUser(req, res, next));

router.get('/admin/test-admin', (req, res, next) => authController.testAdminEndpoint(req, res, next));

module.exports = router;