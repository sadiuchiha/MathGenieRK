const mysql = require('mysql2');

// Create a connection to MySQL without specifying the database initially
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root', // Replace with your MySQL password
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to MySQL');

  // Create the database if it doesn't exist
  db.query("CREATE DATABASE IF NOT EXISTS MathGenieRK", (err) => {
    if (err) throw err;
    console.log("Database MathGenieRK created or already exists");

    // Switch to MathGenieRK database
    db.changeUser({ database: 'MathGenieRK' }, (err) => {
      if (err) throw err;
      console.log("Using database MathGenieRK");

      // Create User table if it doesn't exist
      const createUserTableQuery = `
        CREATE TABLE IF NOT EXISTS User (
          id INT PRIMARY KEY AUTO_INCREMENT,
          firstname VARCHAR(50),
          lastname VARCHAR(50),
          username VARCHAR(50) UNIQUE,
          email VARCHAR(100) UNIQUE,
          password VARCHAR(255),
          user_type ENUM('Admin', 'Viewers') DEFAULT 'Viewers',
          country VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          loggedin_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      db.query(createUserTableQuery, (err) => {
        if (err) throw err;
        console.log("User table created or already exists");

        // Insert default admin user if the table is empty
        const checkAdminQuery = `SELECT * FROM User WHERE username = 'Admin'`;
        db.query(checkAdminQuery, (err, result) => {
          if (err) throw err;
          if (result.length === 0) {
            const insertAdminQuery = `
              INSERT INTO User (firstname, lastname, username, email, password, user_type, country, created_at, loggedin_at)
              VALUES ('Admin', 'Admin', 'Admin', 'test@test.com', 'admin1234', 'Admin', 'Canada', CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
            `;
            db.query(insertAdminQuery, (err) => {
              if (err) throw err;
              console.log("Default admin user created");
            });
          }
        });

        // Create content tables and their corresponding YouTube link and comments tables
        const contentTables = ["Geometry", "Arithmetic", "Algebra", "Advanced", "Worksheets", "FunActivities"];
        contentTables.forEach(table => {
          const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${table} (
              id INT PRIMARY KEY AUTO_INCREMENT,
              filename VARCHAR(255) NOT NULL,
              title VARCHAR(255) NOT NULL,
              chapter VARCHAR(255) NOT NULL,
              youtubeLink VARCHAR(1000),
              description VARCHAR(5000),
              category ENUM('Geometry', 'Arithmetic', 'Algebra', 'Advanced', 'Worksheets', 'FunActivities') NOT NULL,
              file LONGBLOB NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
          `;

          db.query(createTableQuery, (err) => {
            if (err) throw err;
            console.log(`Table ${table} created or already exists`);

          });
        });
      });
    });
  });
});

module.exports = db;