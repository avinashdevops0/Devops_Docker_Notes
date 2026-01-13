require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hr_manager_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
// async function testConnection() {
//     try {
//         const connection = await pool.getConnection();
//         console.log('Database connected successfully');
//         connection.release();
//     } catch (error) {
//         console.error('Database connection failed:', error);
//     }
// }

// testConnection();

async function testConnection(retries = 5, delay = 3000) {
    let attempt = 0;

    while (attempt < retries) {
        try {
            const connection = await pool.getConnection();
            await connection.query('SELECT 1'); // simple query to test DB
            connection.release();
            console.log('✅ Database connected successfully');
            return; // exit function on success
        } catch (error) {
            attempt++;
            console.error(`⏳ Database connection failed (attempt ${attempt}): ${error.message}`);
            if (attempt < retries) {
                // wait before retrying
                await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
                console.error('❌ Could not connect to database after multiple attempts');
                throw error; // exit with error if all retries fail
            }
        }
    }
}

// Call it when starting your app
testConnection();


// ============ EMPLOYEE ROUTES ============

// Get all employees
app.get('/api/employees', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM employees 
            ORDER BY created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

// Get employee by ID
app.get('/api/employees/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM employees WHERE id = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
});

// Create new employee
app.post('/api/employees', async (req, res) => {
    try {
        const {
            employee_id,
            first_name,
            last_name,
            email,
            phone,
            department,
            position,
            salary,
            hire_date,
            status
        } = req.body;

        // Validate required fields
        if (!employee_id || !first_name || !last_name || !email || !hire_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const [result] = await pool.query(
            `INSERT INTO employees 
            (employee_id, first_name, last_name, email, phone, department, position, salary, hire_date, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [employee_id, first_name, last_name, email, phone, department, position, salary, hire_date, status || 'active']
        );

        const [newEmployee] = await pool.query(
            'SELECT * FROM employees WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(newEmployee[0]);
    } catch (error) {
        console.error('Error creating employee:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Employee ID or Email already exists' });
        }
        
        res.status(500).json({ error: 'Failed to create employee' });
    }
});

// Update employee
app.put('/api/employees/:id', async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            phone,
            department,
            position,
            salary,
            status
        } = req.body;

        const [result] = await pool.query(
            `UPDATE employees SET 
            first_name = ?, last_name = ?, email = ?, phone = ?, 
            department = ?, position = ?, salary = ?, status = ?
            WHERE id = ?`,
            [first_name, last_name, email, phone, department, position, salary, status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const [updatedEmployee] = await pool.query(
            'SELECT * FROM employees WHERE id = ?',
            [req.params.id]
        );

        res.json(updatedEmployee[0]);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ error: 'Failed to update employee' });
    }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM employees WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

// ============ LEAVE REQUEST ROUTES ============

// Get all leave requests
app.get('/api/leaves', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT l.*, e.first_name, e.last_name, e.employee_id
            FROM leave_requests l
            JOIN employees e ON l.employee_id = e.id
            ORDER BY l.submitted_at DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching leaves:', error);
        res.status(500).json({ error: 'Failed to fetch leave requests' });
    }
});

// Create leave request
app.post('/api/leaves', async (req, res) => {
    try {
        const { employee_id, leave_type, start_date, end_date, reason } = req.body;

        if (!employee_id || !leave_type || !start_date || !end_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const [result] = await pool.query(
            `INSERT INTO leave_requests 
            (employee_id, leave_type, start_date, end_date, reason) 
            VALUES (?, ?, ?, ?, ?)`,
            [employee_id, leave_type, start_date, end_date, reason]
        );

        const [newLeave] = await pool.query(
            `SELECT l.*, e.first_name, e.last_name, e.employee_id
            FROM leave_requests l
            JOIN employees e ON l.employee_id = e.id
            WHERE l.id = ?`,
            [result.insertId]
        );

        res.status(201).json(newLeave[0]);
    } catch (error) {
        console.error('Error creating leave request:', error);
        res.status(500).json({ error: 'Failed to create leave request' });
    }
});

// Update leave status
app.patch('/api/leaves/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const [result] = await pool.query(
            'UPDATE leave_requests SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Leave request not found' });
        }

        res.json({ message: 'Leave status updated successfully' });
    } catch (error) {
        console.error('Error updating leave status:', error);
        res.status(500).json({ error: 'Failed to update leave status' });
    }
});

// ============ DASHBOARD STATS ============

// Get dashboard statistics
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const [employeeStats] = await pool.query(`
            SELECT 
                COUNT(*) as total_employees,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_employees,
                SUM(CASE WHEN status = 'on_leave' THEN 1 ELSE 0 END) as on_leave,
                AVG(salary) as avg_salary
            FROM employees
        `);

        const [leaveStats] = await pool.query(`
            SELECT 
                COUNT(*) as total_leaves,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_leaves,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_leaves
            FROM leave_requests
        `);

        const [departmentStats] = await pool.query(`
            SELECT department, COUNT(*) as count
            FROM employees
            GROUP BY department
            ORDER BY count DESC
        `);

        res.json({
            employees: employeeStats[0],
            leaves: leaveStats[0],
            departments: departmentStats
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`HR Manager API running on http://localhost:${PORT}`);
});