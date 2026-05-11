CREATE DATABASE IF NOT EXISTS lawvoice;

CREATE USER IF NOT EXISTS 'lawvoice_user'@'localhost' IDENTIFIED BY 'lawvoice_pass';
GRANT ALL PRIVILEGES ON lawvoice.* TO 'lawvoice_user'@'localhost';
FLUSH PRIVILEGES;
