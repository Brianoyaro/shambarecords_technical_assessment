const express = require('express');
const fieldController = require('../controller/fieldController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const UserEnum = require('../enums/userEnum');

const router = express.Router();
router.use(authMiddleware); // Apply authentication middleware to all routes

// Agent endpoints (must come before /:id routes)
router.get('/me', authorize(UserEnum.ROLE.USER, UserEnum.ROLE.ADMIN), (req, res, next) => fieldController.getAllFields(req, res, next));

// Admin endpoints
router.post('/', authorize(UserEnum.ROLE.ADMIN), (req, res, next) => fieldController.createField(req, res, next));
router.get('/', (req, res, next) => fieldController.getAllFields(req, res, next)); // Admin sees all, agents see theirs
router.put('/:id', authorize(UserEnum.ROLE.ADMIN, UserEnum.ROLE.USER), (req, res, next) => fieldController.updateField(req, res, next));
router.delete('/:id', authorize(UserEnum.ROLE.ADMIN), (req, res, next) => fieldController.deleteField(req, res, next));
router.get('/:id', authorize(UserEnum.ROLE.ADMIN, UserEnum.ROLE.USER), (req, res, next) => fieldController.getFieldById(req, res, next));


// field_updates routes
const fieldUpdatesController = require('../controller/fieldUpdatesController');
router.post('/:fieldId/updates', authorize(UserEnum.ROLE.USER, UserEnum.ROLE.ADMIN), (req, res, next) => fieldUpdatesController.createFieldUpdate(req, res, next));
router.get('/:fieldId/updates', authorize(UserEnum.ROLE.ADMIN, UserEnum.ROLE.USER), (req, res, next) => fieldUpdatesController.getFieldUpdates(req, res, next));
router.get('/updates', authorize(UserEnum.ROLE.ADMIN), (req, res, next) => fieldUpdatesController.getAllFieldUpdates(req, res, next));
router.put('/:fieldId/updates/:id', authorize(UserEnum.ROLE.USER, UserEnum.ROLE.ADMIN), (req, res, next) => fieldUpdatesController.updateFieldUpdate(req, res, next));
router.delete('/:fieldId/updates/:id', authorize(UserEnum.ROLE.USER, UserEnum.ROLE.ADMIN), (req, res, next) => fieldUpdatesController.deleteFieldUpdate(req, res, next));

module.exports = router;