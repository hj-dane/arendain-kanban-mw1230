-- Task Board (Kanban) database
-- Import via phpMyAdmin (Import tab) or: mysql -u root < taskboard_db.sql

CREATE DATABASE IF NOT EXISTS taskboard_db;
USE taskboard_db;

DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    owner VARCHAR(100) NOT NULL,
    status ENUM('todo', 'progress', 'done') NOT NULL DEFAULT 'todo'
);

-- Data moved over from js/data.js
INSERT INTO tasks (id, title, description, owner, status) VALUES
(1, 'Design login page', 'Wireframe + high-fidelity mockup', 'Anna', 'todo'),
(2, 'Set up repository', 'Init repo, branching strategy, README', 'Marco', 'done'),
(3, 'Build task-form.html', 'Add/edit form with validation', 'HJ', 'progress'),
(4, 'Style kanban board', 'Column layout, card component', 'HJ', 'progress'),
(5, 'Write project proposal', '1-page scope doc for client review', 'Anna', 'done'),
(6, 'User testing plan', 'Draft test script for 5 participants', 'Marco', 'todo');
