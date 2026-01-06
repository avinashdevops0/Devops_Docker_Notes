const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');

// Task routes
router.get('/tasks', TaskController.getAllTasks);
router.get('/tasks/stats', TaskController.getStats);
router.get('/tasks/:id', TaskController.getTask);
router.post('/tasks', TaskController.createTask);
router.put('/tasks/:id', TaskController.updateTask);
router.delete('/tasks/:id', TaskController.deleteTask);

module.exports = router;