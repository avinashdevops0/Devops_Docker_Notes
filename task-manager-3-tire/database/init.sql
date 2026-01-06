-- Create database
CREATE DATABASE IF NOT EXISTS task_manager;
USE task_manager;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO tasks (title, description, status, priority, due_date) VALUES
('Setup project structure', 'Create 3-tier architecture for task manager', 'completed', 'high', '2024-01-10'),
('Design database schema', 'Create MySQL tables and relationships', 'completed', 'high', '2024-01-12'),
('Build REST API', 'Implement CRUD operations for tasks', 'in-progress', 'high', '2024-01-15'),
('Create frontend UI', 'Build responsive task management interface', 'pending', 'medium', '2024-01-18'),
('Add user authentication', 'Implement login and registration system', 'pending', 'low', '2024-01-25');

CREATE USER 'dev_task_manager'@'%' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON *.* TO 'dev_task_manager'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

