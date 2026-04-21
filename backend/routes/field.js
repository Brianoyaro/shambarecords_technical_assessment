const express = require('express');
const fieldController = require('../controller/fieldController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const UserEnum = require('../enums/userEnum');

const router = express.Router();
router.use(authMiddleware); // Apply authentication middleware to all routes

// Admin endpoints
router.post('/', authorize(UserEnum.ROLE.ADMIN), (req, res, next) => fieldController.createField(req, res, next));
router.get('/', authorize(UserEnum.ROLE.ADMIN), (req, res, next) => fieldController.getAllFields(req, res, next));
router.put('/:id', authorize(UserEnum.ROLE.ADMIN), (req, res, next) => fieldController.updateField(req, res, next));
router.delete('/:id', authorize(UserEnum.ROLE.ADMIN), (req, res, next) => fieldController.deleteField(req, res, next));

// Agent endpoints
router.get('/agent', authorize(UserEnum.ROLE.USER), (req, res, next) => fieldController.getFieldsByAgentId(req, res, next));
router.get('/:id', authorize(UserEnum.ROLE.ADMIN, UserEnum.ROLE.USER), (req, res, next) => fieldController.getFieldById(req, res, next));


module.exports = router;