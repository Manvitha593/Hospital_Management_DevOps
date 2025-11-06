// This is server.js(Test Commit for trigger)
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;
const db = require("./db");

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // serve HTML, CSS, JS from /public folder

// Basic test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running successfully!" });
});

// ---------------------- PATIENT ROUTES ----------------------
// Add a new patient
app.post("/api/patients", (req, res) => {
  const { name, age, gender, contact } = req.body;

  if (!name || !contact) {
    return res.status(400).json({ error: "Name and contact are required" });
  }

  const sql = `INSERT INTO patients (name, age, gender, contact) VALUES (?, ?, ?, ?)`;
  db.run(sql, [name, age, gender, contact], function (err) {
    if (err) {
      console.error("Error inserting patient:", err.message);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json({ message: "Patient added successfully", id: this.lastID });
    }
  });
});

// Get all patients
app.get("/api/patients", (req, res) => {
  const sql = `SELECT * FROM patients`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching patients:", err.message);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(rows);
    }
  });
});

app.get("/api/doctors", (req, res) => {
  db.all("SELECT * FROM doctors", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
// Doctors API 
app.post("/api/doctors", (req, res) => {
  const { name, specialization, available_from, available_to } = req.body;
  if (!name || !specialization || !available_from || !available_to)
    return res.status(400).json({ error: "All fields are required" });

  db.run(
    "INSERT INTO doctors (name, specialization, available_from, available_to) VALUES (?, ?, ?, ?)",
    [name, specialization, available_from, available_to],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Doctor added", id: this.lastID });
    }
  );
});

// --- Appointments --- //

// Add new appointment
app.post("/api/appointments", (req, res) => {
  const { patient_id, doctor_id, date, time } = req.body;

  if (!patient_id || !doctor_id || !date || !time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `INSERT INTO appointments (patient_id, doctor_id, date, time) VALUES (?, ?, ?, ?)`;
  db.run(sql, [patient_id, doctor_id, date, time], function (err) {
    if (err) {
      console.error("❌ Error adding appointment:", err.message);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json({ message: "Appointment added successfully", id: this.lastID });
    }
  });
});

// Get all appointments (optionally filter by doctor)
app.get("/api/appointments", (req, res) => {
  const { doctor_id } = req.query;

  let sql = `
    SELECT 
      appointments.id,
      patients.name AS patient_name,
      doctors.name AS doctor_name,
      appointments.date,
      appointments.time
    FROM appointments
    LEFT JOIN patients ON appointments.patient_id = patients.id
    LEFT JOIN doctors ON appointments.doctor_id = doctors.id
  `;

  const params = [];
  if (doctor_id) {
    sql += " WHERE doctor_id = ?";
    params.push(doctor_id);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("❌ Error fetching appointments:", err.message);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(rows);
    }
  });
});

// Get all billing records
app.get("/api/billing", (req, res) => {
  const sql = `
    SELECT billing.*, patients.name AS patient_name 
    FROM billing 
    LEFT JOIN patients ON billing.patient_id = patients.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching billing:", err.message);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(rows);
    }
  });
});

// Add new billing record
app.post("/api/billing", (req, res) => {
  const { patient_id, amount, date, details } = req.body;

  if (!patient_id || !amount || !date) {
    return res.status(400).json({ error: "Patient, amount, and date are required" });
  }

  const sql = `INSERT INTO billing (patient_id, amount, date, details) VALUES (?, ?, ?, ?)`;
  db.run(sql, [patient_id, amount, date, details], function (err) {
    if (err) {
      console.error("Error inserting billing:", err.message);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json({ message: "Billing added successfully", id: this.lastID });
    }
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});
