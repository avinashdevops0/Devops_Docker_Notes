CREATE DATABASE IF NOT EXISTS coffee_shop;
USE coffee_shop;

CREATE TABLE IF NOT EXISTS coffee_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    coffee_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (coffee_id) REFERENCES coffee_items(id)
);

INSERT INTO coffee_items (name, description, price, category, image_url) VALUES
('Espresso', 'Strong and concentrated coffee', 3.50, 'Hot Coffee', 'images/coffee1.jpg'),
('Cappuccino', 'Espresso with steamed milk foam', 4.25, 'Hot Coffee', 'images/coffee2.jpg'),
('Latte', 'Smooth espresso with steamed milk', 4.75, 'Hot Coffee', 'images/coffee3.jpg'),
('Iced Coffee', 'Chilled coffee with ice', 3.75, 'Cold Coffee', 'images/coffee4.jpg'),
('Mocha', 'Chocolate-flavored latte', 5.00, 'Hot Coffee', 'images/coffee1.jpg'),
('Americano', 'Espresso with hot water', 3.25, 'Hot Coffee', 'images/coffee2.jpg');