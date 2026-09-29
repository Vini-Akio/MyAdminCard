CREATE DATABASE IF NOT EXISTS card_manager;
USE card_manager;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- Inserindo admin inicial (a senha plain será convertida em hash no primeiro login)
INSERT INTO users (username, password_hash) VALUES ('admin', 'admin123');

CREATE TABLE IF NOT EXISTS cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_pt VARCHAR(100),
    game VARCHAR(50) NOT NULL,
    edition_id INT NOT NULL,
    image_url VARCHAR(255),
    rarity VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
