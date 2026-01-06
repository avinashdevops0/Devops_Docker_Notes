const { pool } = require('../config/database');

class TaskModel {
    // Get all tasks
    static async getAllTasks(filters = {}) {
        let query = 'SELECT * FROM tasks WHERE 1=1';
        const params = [];
        
        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }
        
        if (filters.priority) {
            query += ' AND priority = ?';
            params.push(filters.priority);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [rows] = await pool.execute(query, params);
        return rows;
    }
    
    // Get task by ID
    static async getTaskById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM tasks WHERE id = ?',
            [id]
        );
        return rows[0];
    }
    
    // Create new task
    static async createTask(taskData) {
        const { title, description, status, priority, due_date } = taskData;
        const [result] = await pool.execute(
            'INSERT INTO tasks (title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?)',
            [title, description || null, status || 'pending', priority || 'medium', due_date || null]
        );
        return { id: result.insertId, ...taskData };
    }
    
    // Update task
    static async updateTask(id, taskData) {
        const { title, description, status, priority, due_date } = taskData;
        const [result] = await pool.execute(
            `UPDATE tasks 
             SET title = ?, description = ?, status = ?, priority = ?, due_date = ?
             WHERE id = ?`,
            [title, description || null, status, priority, due_date || null, id]
        );
        return result.affectedRows > 0;
    }
    
    // Delete task
    static async deleteTask(id) {
        const [result] = await pool.execute(
            'DELETE FROM tasks WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
    
    // Get task statistics
    static async getTaskStats() {
        const [rows] = await pool.execute(`
            SELECT 
                status,
                COUNT(*) as count,
                priority,
                COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority
            FROM tasks 
            GROUP BY status
        `);
        return rows;
    }
}

module.exports = TaskModel;