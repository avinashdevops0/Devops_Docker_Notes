const Task = require('../models/taskModel');

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.getAll();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.getById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const taskData = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status || 'pending',
            priority: req.body.priority || 'medium',
            due_date: req.body.due_date
        };
        const newTask = await Task.create(taskData);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const taskData = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            priority: req.body.priority,
            due_date: req.body.due_date
        };
        const updatedTask = await Task.update(req.params.id, taskData);
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await Task.delete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTasksByStatus = async (req, res) => {
    try {
        const tasks = await Task.getByStatus(req.params.status);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};