const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticate = require('../middleware/auth');

// All task routes require authentication
router.use(authenticate);

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/users', taskController.getAllUsers);
router.get('/:id', taskController.getTaskById);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
