const TaskModel = require('../models/taskModel');

class TaskController {
    // Get all tasks
    static async getAllTasks(req, res) {
        try {
            const filters = req.query;
            const tasks = await TaskModel.getAllTasks(filters);
            res.json({
                success: true,
                count: tasks.length,
                data: tasks
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching tasks',
                error: error.message
            });
        }
    }
    
    // Get single task
    static async getTask(req, res) {
        try {
            const task = await TaskModel.getTaskById(req.params.id);
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }
            res.json({
                success: true,
                data: task
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching task',
                error: error.message
            });
        }
    }
    
    // Create task
    static async createTask(req, res) {
        try {
            const requiredFields = ['title'];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({
                        success: false,
                        message: `${field} is required`
                    });
                }
            }
            
            const newTask = await TaskModel.createTask(req.body);
            res.status(201).json({
                success: true,
                message: 'Task created successfully',
                data: newTask
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating task',
                error: error.message
            });
        }
    }
    
    // Update task
    static async updateTask(req, res) {
        try {
            const updated = await TaskModel.updateTask(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }
            
            const task = await TaskModel.getTaskById(req.params.id);
            res.json({
                success: true,
                message: 'Task updated successfully',
                data: task
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating task',
                error: error.message
            });
        }
    }
    
    // Delete task
    static async deleteTask(req, res) {
        try {
            const deleted = await TaskModel.deleteTask(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }
            res.json({
                success: true,
                message: 'Task deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting task',
                error: error.message
            });
        }
    }
    
    // Get statistics
    static async getStats(req, res) {
        try {
            const stats = await TaskModel.getTaskStats();
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching statistics',
                error: error.message
            });
        }
    }
}

module.exports = TaskController;