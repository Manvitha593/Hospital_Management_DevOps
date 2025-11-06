//Duplicate commit
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('hospital.db'); // adjust if your file name differs

db.serialize(() => {
  db.run("DELETE FROM patients");
  db.run("DELETE FROM doctors");
  db.run("DELETE FROM appointments");
  db.run("DELETE FROM billing");
  db.run("VACUUM");
  console.log("✅ All data cleared, tables kept intact.");
});

db.close();
