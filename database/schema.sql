CREATE DATABASE IF NOT EXISTS MathGenieRK;
USE MathGenieRK;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    country VARCHAR(255) NOT NULL,
    user_type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    loggedin_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);