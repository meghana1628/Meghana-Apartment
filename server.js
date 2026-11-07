
// ==========================================
// APARTMENT MAINTENANCE REQUEST MANAGEMENT
// ==========================================

// 1. Import Packages
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

// 2. Create Express Application
const app = express();
const PORT = 3000;

// 3. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// 5. MySQL Database Connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'apartment_maintenance',
    port: 3307,
    waitForConnections: true,
    connectionLimit: 10
}).promise();

// 6. Check Database Connection
async function startServer() {
    try {
        await db.query('SELECT 1');
        console.log('MySQL Database Connected Successfully!');

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.log('Database Connection Error:', err.message);
    }
}

// ==========================================
// DASHBOARD
// ==========================================

app.get('/api/dashboard', async (req, res) => {
    try {
        const [residents] = await db.query(
            'SELECT COUNT(*) AS total FROM residents'
        );

        const [staff] = await db.query(
            'SELECT COUNT(*) AS total FROM maintenance_staff'
        );

        const [requests] = await db.query(
            'SELECT COUNT(*) AS total FROM requests'
        );

        const [pending] = await db.query(
            "SELECT COUNT(*) AS total FROM requests WHERE status = 'Pending'"
        );

        const [completed] = await db.query(
            "SELECT COUNT(*) AS total FROM requests WHERE status = 'Completed'"
        );

        res.json({
            residents: residents[0].total,
            staff: staff[0].total,
            requests: requests[0].total,
            pending: pending[0].total,
            completed: completed[0].total
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// RESIDENTS CRUD OPERATIONS
// ==========================================

// READ ALL RESIDENTS
app.get('/api/residents', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT resident_id, full_name, email, phone,
             flat_number, building_name FROM residents`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ SINGLE RESIDENT
app.get('/api/residents/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT resident_id, full_name, email, phone,
             flat_number, building_name FROM residents
             WHERE resident_id = ?`,
            [req.params.id]
        );

        if (rows.length === 0)
            return res.status(404).json({ message: 'Resident not found' });

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE RESIDENT
app.post('/api/residents', async (req, res) => {
    try {
        const { full_name, email, phone, flat_number,
            building_name, password } = req.body;

        const [result] = await db.query(
            `INSERT INTO residents
            (full_name, email, phone, flat_number, building_name, password)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [full_name, email, phone, flat_number, building_name, password]
        );

        res.status(201).json({
            message: 'Resident added successfully',
            resident_id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE RESIDENT
app.put('/api/residents/:id', async (req, res) => {
    try {
        const { full_name, email, phone, flat_number,
            building_name, password } = req.body;

        const [result] = await db.query(
            `UPDATE residents SET
            full_name = ?, email = ?, phone = ?,
            flat_number = ?, building_name = ?, password = ?
            WHERE resident_id = ?`,
            [full_name, email, phone, flat_number,
                building_name, password, req.params.id]
        );

        res.json({ message: 'Resident updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE RESIDENT
app.delete('/api/residents/:id', async (req, res) => {
    try {
        await db.query(
            'DELETE FROM residents WHERE resident_id = ?',
            [req.params.id]
        );

        res.json({ message: 'Resident deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// MAINTENANCE STAFF CRUD OPERATIONS
// ==========================================

// READ ALL STAFF
app.get('/api/staff', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM maintenance_staff'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ SINGLE STAFF
app.get('/api/staff/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM maintenance_staff WHERE staff_id = ?',
            [req.params.id]
        );

        if (rows.length === 0)
            return res.status(404).json({ message: 'Staff not found' });

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE STAFF
app.post('/api/staff', async (req, res) => {
    try {
        const { full_name, email, phone,
            specialization, availability } = req.body;

        const [result] = await db.query(
            `INSERT INTO maintenance_staff
            (full_name, email, phone, specialization, availability)
            VALUES (?, ?, ?, ?, ?)`,
            [full_name, email, phone, specialization, availability]
        );

        res.status(201).json({
            message: 'Staff added successfully',
            staff_id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE STAFF
app.put('/api/staff/:id', async (req, res) => {
    try {
        const { full_name, email, phone,
            specialization, availability } = req.body;

        await db.query(
            `UPDATE maintenance_staff SET
            full_name = ?, email = ?, phone = ?,
            specialization = ?, availability = ?
            WHERE staff_id = ?`,
            [full_name, email, phone, specialization,
                availability, req.params.id]
        );

        res.json({ message: 'Staff updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE STAFF
app.delete('/api/staff/:id', async (req, res) => {
    try {
        await db.query(
            'DELETE FROM maintenance_staff WHERE staff_id = ?',
            [req.params.id]
        );

        res.json({ message: 'Staff deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// MAINTENANCE REQUESTS CRUD OPERATIONS
// ==========================================

// READ ALL REQUESTS
app.get('/api/requests', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT r.*, res.full_name AS resident_name,
             s.full_name AS staff_name
             FROM requests r
             JOIN residents res ON r.resident_id = res.resident_id
             LEFT JOIN maintenance_staff s ON r.staff_id = s.staff_id
             ORDER BY r.request_id DESC`
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ SINGLE REQUEST
app.get('/api/requests/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM requests WHERE request_id = ?',
            [req.params.id]
        );

        if (rows.length === 0)
            return res.status(404).json({ message: 'Request not found' });

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE REQUEST
app.post('/api/requests', async (req, res) => {
    try {
        const { resident_id, staff_id, category,
            description, priority, status, request_date } = req.body;

        const [result] = await db.query(
            `INSERT INTO requests
            (resident_id, staff_id, category, description,
             priority, status, request_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [resident_id, staff_id || null, category,
                description, priority, status || 'Pending',
                request_date || new Date()]
        );

        res.status(201).json({
            message: 'Request added successfully',
            request_id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE REQUEST
app.put('/api/requests/:id', async (req, res) => {
    try {
        const { resident_id, staff_id, category,
            description, priority, status, request_date } = req.body;

        await db.query(
            `UPDATE requests SET
            resident_id = ?, staff_id = ?, category = ?,
            description = ?, priority = ?, status = ?,
            request_date = ?
            WHERE request_id = ?`,
            [resident_id, staff_id || null, category,
                description, priority, status, request_date,
                req.params.id]
        );

        res.json({ message: 'Request updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE REQUEST
app.delete('/api/requests/:id', async (req, res) => {
    try {
        await db.query(
            'DELETE FROM requests WHERE request_id = ?',
            [req.params.id]
        );

        res.json({ message: 'Request deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// MAINTENANCE RECORDS CRUD OPERATIONS
// ==========================================

// READ ALL MAINTENANCE RECORDS
app.get('/api/records', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT m.*, s.full_name AS staff_name,
             r.category, r.description AS request_description
             FROM maintenance_records m
             JOIN maintenance_staff s ON m.staff_id = s.staff_id
             JOIN requests r ON m.request_id = r.request_id
             ORDER BY m.record_id DESC`
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ SINGLE RECORD
app.get('/api/records/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM maintenance_records WHERE record_id = ?',
            [req.params.id]
        );

        if (rows.length === 0)
            return res.status(404).json({ message: 'Record not found' });

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE MAINTENANCE RECORD
app.post('/api/records', async (req, res) => {
    try {
        const { request_id, staff_id, work_description,
            start_date, completion_date, cost, remarks } = req.body;

        const [result] = await db.query(
            `INSERT INTO maintenance_records
            (request_id, staff_id, work_description,
             start_date, completion_date, cost, remarks)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [request_id, staff_id, work_description,
                start_date, completion_date || null, cost,
                remarks || null]
        );

        res.status(201).json({
            message: 'Maintenance record added successfully',
            record_id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE MAINTENANCE RECORD
app.put('/api/records/:id', async (req, res) => {
    try {
        const { request_id, staff_id, work_description,
            start_date, completion_date, cost, remarks } = req.body;

        await db.query(
            `UPDATE maintenance_records SET
            request_id = ?, staff_id = ?, work_description = ?,
            start_date = ?, completion_date = ?, cost = ?, remarks = ?
            WHERE record_id = ?`,
            [request_id, staff_id, work_description,
                start_date, completion_date || null, cost,
                remarks || null, req.params.id]
        );

        res.json({ message: 'Maintenance record updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE MAINTENANCE RECORD
app.delete('/api/records/:id', async (req, res) => {
    try {
        await db.query(
            'DELETE FROM maintenance_records WHERE record_id = ?',
            [req.params.id]
        );

        res.json({ message: 'Maintenance record deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// START SERVER
// ==========================================

startServer();
