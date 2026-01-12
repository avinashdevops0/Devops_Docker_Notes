-- Create database
CREATE DATABASE IF NOT EXISTS userdb;
USE userdb;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email, age) VALUES
('John Doe', 'john@example.com', 25),
('Jane Smith', 'jane@example.com', 30),
('Bob Johnson', 'bob@example.com', 35);