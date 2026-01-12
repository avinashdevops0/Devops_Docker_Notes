const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection on startup
db.testConnection();

// API Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: '3-tier-app-backend'
    });
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await db.query('SELECT * FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get single user
app.get('/api/users/:id', async (req, res) => {
    try {
        const users = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(users[0]);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Create new user
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        
        const result = await db.query(
            'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
            [name, email, age || null]
        );
        
        const newUser = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
        res.status(201).json(newUser[0]);
    } catch (err) {
        console.error('Error creating user:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Database error' });
        }
    }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        
        const result = await db.query(
            'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
            [name, email, age || null, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const updatedUser = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        res.json(updatedUser[0]);
    } catch (err) {
        console.error('Error updating user:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Database error' });
        }
    }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});