CREATE DATABASE IF NOT EXISTS task_manager;
USE task_manager;

CREATE TABLE IF NOT EXISTS tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO tasks (title, description, status, priority, due_date) VALUES
('Complete project proposal', 'Write and submit the project proposal document', 'pending', 'high', '2024-12-20'),
('Buy groceries', 'Milk, eggs, bread, and fruits', 'pending', 'medium', '2024-12-15'),
('Schedule meeting', 'Team meeting for project review', 'completed', 'high', '2024-12-10');

CREATE USER 'root'@'%' IDENTIFIED BY 'rootpassword';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;