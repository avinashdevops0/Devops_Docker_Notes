const mysql = require('mysql2/promise');

class Database {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'userdb',
            port: process.env.DB_PORT || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    async query(sql, params) {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows;
        } catch (err) {
            console.error('Database query error:', err);
            throw err;
        }
    }

    async testConnection() {
        try {
            const connection = await this.pool.getConnection();
            console.log('✅ Database connected successfully');
            connection.release();
            return true;
        } catch (err) {
            console.error('❌ Database connection failed:', err.message);
            return false;
        }
    }
}

module.exports = new Database();