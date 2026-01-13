-- Create database
CREATE DATABASE IF NOT EXISTS hr_manager_db;
USE hr_manager_db;

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(50),
    position VARCHAR(50),
    salary DECIMAL(10, 2),
    hire_date DATE NOT NULL,
    status ENUM('active', 'on_leave', 'terminated') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leave requests table
CREATE TABLE IF NOT EXISTS leave_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    leave_type ENUM('vacation', 'sick', 'personal', 'maternity', 'paternity'),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO employees (employee_id, first_name, last_name, email, phone, department, position, salary, hire_date) VALUES
('EMP001', 'John', 'Doe', 'john.doe@company.com', '555-0101', 'Engineering', 'Software Engineer', 75000.00, '2023-01-15'),
('EMP002', 'Jane', 'Smith', 'jane.smith@company.com', '555-0102', 'Marketing', 'Marketing Manager', 85000.00, '2022-03-10'),
('EMP003', 'Robert', 'Johnson', 'robert.j@company.com', '555-0103', 'Sales', 'Sales Executive', 65000.00, '2023-06-20');

INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status) VALUES
(1, 'vacation', '2024-12-20', '2024-12-27', 'Family vacation', 'approved'),
(2, 'sick', '2024-12-15', '2024-12-16', 'Flu', 'approved'),
(3, 'personal', '2024-12-22', '2024-12-23', 'Doctor appointment', 'pending');