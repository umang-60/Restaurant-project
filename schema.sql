-- 1. Create the database container
CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

-- 2. Create the food entries storage table
CREATE TABLE IF NOT EXISTS foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Insert a fresh default seed record
INSERT INTO foods (name, price, category, description) 
VALUES ('Veg Burger', 120.00, 'Fast Food', 'Crispy veg patty with cheese and lettuce');
