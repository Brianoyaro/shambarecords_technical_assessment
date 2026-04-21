const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

// Registration endpoint
router.post('/register', (req, res, next) => authController.register(req, res, next));

// Login endpoint
router.post('/login', (req, res, next) => authController.login(req, res, next));


module.exports = router;