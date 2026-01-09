const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET all tasks
router.get('/tasks', taskController.getAllTasks);

// GET tasks by status
router.get('/tasks/status/:status', taskController.getTasksByStatus);

// GET single task
router.get('/tasks/:id', taskController.getTaskById);

// POST create new task
router.post('/tasks', taskController.createTask);

// PUT update task
router.put('/tasks/:id', taskController.updateTask);

// DELETE task
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;