// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file (it will be created automatically if not exists)
const dbPath = path.join(__dirname, 'hospital.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

// Create tables if they don't exist
db.serialize(() => {
  // Patients table
  db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER,
      gender TEXT,
      contact TEXT
    )
  `);

  // Doctors table
  db.run(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      specialization TEXT,
      available_from TEXT,
      available_to TEXT
    )
  `);

  // Appointments table
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      doctor_id INTEGER,
      date TEXT,
      time TEXT,
      FOREIGN KEY (patient_id) REFERENCES patients(id),
      FOREIGN KEY (doctor_id) REFERENCES doctors(id)
    )
  `);

  // Billing table
  db.run(`
    CREATE TABLE IF NOT EXISTS billing (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      amount REAL,
      date TEXT,
      details TEXT,
      FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
  `);

  console.log("✅ Tables verified/created successfully");
});

module.exports = db;
