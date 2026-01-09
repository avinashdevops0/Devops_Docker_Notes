const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', taskRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Task Manager API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api/tasks`);
});