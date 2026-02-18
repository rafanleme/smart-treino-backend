-- SmartTreino Database Setup
-- Copie e cole estes comandos no MySQL Workbench ou Command Line

CREATE DATABASE IF NOT EXISTS smarttreino_dev
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'smarttreino'@'localhost' IDENTIFIED BY 'smarttreino123';

GRANT ALL PRIVILEGES ON smarttreino_dev.* TO 'smarttreino'@'localhost';

FLUSH PRIVILEGES;

USE smarttreino_dev;

SELECT 'Database smarttreino_dev criado com sucesso!' AS status;
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User = 'smarttreino';
