-- Task Board (Kanban) database
-- Re-importing this file resets the table (DROP + CREATE), so existing edits will be lost.
-- Import via phpMyAdmin (Import tab) or: mysql -u root < taskboard_db.sql

CREATE DATABASE IF NOT EXISTS taskboard_db;
USE taskboard_db;

DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    owner VARCHAR(100) NOT NULL,
    status ENUM('todo', 'progress', 'done') NOT NULL DEFAULT 'todo',

    -- Soft delete: DELETE /api/tasks/:id sets this to 1 instead of removing the row,
    -- so the task shows up in the dashboard's "Archived" card/list instead of
    -- disappearing. DELETE /api/tasks/permanent is the only route that actually
    -- removes rows (and only rows where archived = 1), for the "delete permanently"
    -- option in the Archived view.
    archived TINYINT(1) NOT NULL DEFAULT 0,

    -- Used by the dashboard's From/To date filters (GET /api/tasks?from=&to=)
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Data moved over from js/data.js
INSERT INTO tasks (id, title, description, owner, status) VALUES
(1, 'Design login page', 'Wireframe + high-fidelity mockup', 'Anna', 'todo'),
(2, 'Set up repository', 'Init repo, branching strategy, README', 'Marco', 'done'),
(3, 'Build task-form.html', 'Add/edit form with validation', 'HJ', 'progress'),
(4, 'Style kanban board', 'Column layout, card component', 'HJ', 'progress'),
(5, 'Write project proposal', '1-page scope doc for client review', 'Anna', 'done'),
(6, 'User testing plan', 'Draft test script for 5 participants', 'Marco', 'todo');
