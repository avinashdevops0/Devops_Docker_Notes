const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/database');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client folder
app.use(express.static(path.join(__dirname, '../client')));

// Routes
app.use('/api', taskRoutes);

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// API health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Task Manager API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
    console.log(`Frontend available at http://localhost:${PORT}`);
    
    // Test database connection
    await testConnection();
});