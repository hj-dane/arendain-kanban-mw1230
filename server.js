const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// Allow JSON data
app.use(express.json());

// Serve the pages (index.html, board.html, task-form.html)
app.use(express.static(__dirname));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "taskboard_db"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: ", err);
        return;
    }

    console.log("Connected to MySQL");
});

const STATUSES = ["todo", "progress", "done"];

// GET all tasks
app.get("/api/tasks", (req, res) => {
    db.query("SELECT * FROM tasks", (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});

// GET one task
app.get("/api/tasks/:id", (req, res) => {
    db.query("SELECT * FROM tasks WHERE id = ?", [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(results[0]);
    });
});

// POST add a task
app.post("/api/tasks", (req, res) => {
    const { title, description, owner, status } = req.body;

    if (!title || !owner) {
        return res.status(400).json({ message: "title and owner are required" });
    }

    const taskStatus = STATUSES.includes(status) ? status : "todo";

    const sql = `
        INSERT INTO tasks
        (title, description, owner, status)
        VALUES (?,?,?,?)
    `;

    db.query(sql, [title, description, owner, taskStatus], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({
            message: "Task added successfully",
            id: result.insertId
        });
    });
});

// PUT edit a task
app.put("/api/tasks/:id", (req, res) => {
    const { title, description, owner, status } = req.body;

    if (!title || !owner) {
        return res.status(400).json({ message: "title and owner are required" });
    }

    const taskStatus = STATUSES.includes(status) ? status : "todo";

    const sql = `
        UPDATE tasks
        SET title = ?, description = ?, owner = ?, status = ?
        WHERE id = ?
    `;

    db.query(sql, [title, description, owner, taskStatus, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Task updated successfully" });
    });
});

// PATCH change only the status of a task
app.patch("/api/tasks/:id/status", (req, res) => {
    const { status } = req.body;

    if (!STATUSES.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    db.query("UPDATE tasks SET status = ? WHERE id = ?", [status, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Status updated successfully" });
    });
});

// DELETE a task
app.delete("/api/tasks/:id", (req, res) => {
    db.query("DELETE FROM tasks WHERE id = ?", [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});