const db = require('../config/database');

class Task {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(taskData) {
        const { title, description, status, priority, due_date } = taskData;
        const [result] = await db.query(
            'INSERT INTO tasks (title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?)',
            [title, description, status, priority, due_date]
        );
        return { id: result.insertId, ...taskData };
    }

    static async update(id, taskData) {
        const { title, description, status, priority, due_date } = taskData;
        await db.query(
            'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ? WHERE id = ?',
            [title, description, status, priority, due_date, id]
        );
        return { id, ...taskData };
    }

    static async delete(id) {
        await db.query('DELETE FROM tasks WHERE id = ?', [id]);
        return true;
    }

    static async getByStatus(status) {
        const [rows] = await db.query('SELECT * FROM tasks WHERE status = ? ORDER BY created_at DESC', [status]);
        return rows;
    }
}

module.exports = Task;