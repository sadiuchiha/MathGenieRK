const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const db = require('./database/dbConfig'); // Import dbConfig.js
const app = express();
const port = 8080;

// Middleware to serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'homePage/index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'loggedinhomepage/loggedinhomepage.html'));
});

// Route to serve login.html
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'logInPage/login.html'));
});

// Route to serve login.html
app.get('/materials', (req, res) => {
    res.sendFile(path.join(__dirname, 'downloadPage/downloadpage.html'));
});


// Route to serve login.html
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log("Received login request:", { username, password });

    db.query("SELECT * FROM User WHERE username = ? AND password = ?", [username, password], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Server error. Please try again later." });
        }
        if (result.length === 0) {
            console.log("No matching user found.");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const userType = result[0].user_type;
        console.log("User found:", { userType });

        // Respond with user type instead of redirecting (client handles redirection)
        res.json({ message: "Login successful!", user_type: userType });
    });
});


// Route to serve signup.html
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signUpPage/signup.html'));
});

// POST route to handle signup
app.post('/signup', (req, res) => {
    const { firstname, lastname, username, email, password, country } = req.body;

    // SQL query to insert new user into the User table
    const insertUserQuery = `
        INSERT INTO User (firstname, lastname, username, email, password, user_type, country)
        VALUES (?, ?, ?, ?, ?, 'Viewers', ?);
    `;

    db.query(insertUserQuery, [firstname, lastname, username, email, password, country], (err, result) => {
        if (err) {
            console.error("Error inserting user:", err);
            res.status(500).json({ message: 'Error signing up user' });
        } else {
            console.log("New user signed up:", req.body);
            res.json({ message: 'Sign up successful!' });
        }
    });
});

// Admin routes
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'adminPage/admin.html'));
});

app.get('/admin/users', (req, res) => {
    db.query("SELECT id, username, email, user_type FROM User", (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to retrieve users" });
        res.json(results);
    });
});

app.get('/admin/contentTables', async (req, res) => {
    const contentTables = ["Geometry", "Arithmetic", "Algebra", "AdvancedMathematics", "Worksheets", "FunActivities"];
    const contentData = {};

    try {
        // Run each SELECT query individually and store the results in an array of promises
        const queries = contentTables.map(table => {
            return new Promise((resolve, reject) => {
                db.query(`SELECT id, filename, title, chapter, '${table}' AS category FROM ${table}`, (err, results) => {
                    if (err) {
                        return reject(`Failed to retrieve content for table ${table}`);
                    }
                    // Populate each category, even if the results are empty
                    contentData[table] = results.length > 0 ? results : [];
                    resolve();
                });
            });
        });

        // Wait for all queries to finish
        await Promise.all(queries);

        // Send back the content data as JSON
        res.json(contentData);
    } catch (error) {
        console.error("Error retrieving content tables:", error);
        res.status(500).json({ error: "Failed to retrieve content for one or more tables." });
    }
});

app.post('/admin/addContent', (req, res) => {
    const { filename, title, chapter, youtubeLink, description, category } = req.body;
    const file = req.files.file;
    console.log(filename, title, chapter, youtubeLink, description, category)
    // Store PDF as blob or store path in database
    const query = `INSERT INTO ${category} (filename, title, chapter, youtubeLink, description, category, file) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, [filename, title, chapter, youtubeLink, description, category, file.data], (err) => {
        if (err) return res.status(500).json({ error: "Failed to add content" });
        res.json({ message: "Content added successfully" });
    });
});


// Endpoint for editing users
app.put('/admin/editUser/:id', (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;
    
    // SQL query to update user data
    const query = "UPDATE User SET username = ?, email = ?, user_type = ?, firstname = ?, lastname = ?, password = ?, country = ? WHERE id = ?";
    
    db.query(query, [updatedData.username, updatedData.email, updatedData.user_type, updatedData.firstname, updatedData.lastname,
        updatedData.password, updatedData.country, userId], (err, result) => {
        if (err) {
            console.error("Error updating user:", err);
            return res.status(500).send("Failed to update user");
        }
        res.send("User updated successfully");
    });
});

// Endpoint for editing content
app.put('/admin/editContent/:id', (req, res) => {
    const contentId = req.params.id;
    const updatedData = req.body;
    
    // SQL query to update content data
    const query = "UPDATE ?? SET filename = ?, title = ?, chapter = ?, youtubeLink = ?, description = ?, category = ? WHERE id = ?";
    
    // Use db.query for MySQL, and escape the table name dynamically
    db.query(query, [updatedData.category, updatedData.filename, updatedData.title, updatedData.chapter, updatedData.youtubeLink, updatedData.description, updatedData.category, contentId], (err, result) => {
        if (err) {
            console.error("Error updating content:", err);
            return res.status(500).send("Failed to update content");
        }
        res.send("Content updated successfully");
    });
});
// Endpoint to get a specific user by ID
app.get('/admin/getUser/:id', (req, res) => {
    const userId = req.params.id;
    const query = "SELECT id, username, firstname, lastname, email, country, password, user_type FROM User WHERE id = ?";
    db.query(query, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to retrieve user data" });
        if (result.length === 0) return res.status(404).json({ error: "User not found" });
        res.json(result[0]);
    });
});

// Endpoint to get a specific content item by ID
app.get('/admin/getContent/:id', (req, res) => {
    const contentId = req.params.id;
    const query = `
        SELECT id, filename, title, chapter, youtubeLink, description, category
        FROM ${req.query.category}
        WHERE id = ?`;
    db.query(query, [contentId], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to retrieve content data" });
        if (result.length === 0) return res.status(404).json({ error: "Content not found" });
        res.json(result[0]);
    });
});

// Endpoint for deleting a user
app.delete('/admin/deleteUser/:id', (req, res) => {
    const userId = req.params.id;
    
    // SQL query to delete user
    const query = "DELETE FROM users WHERE id = ?";
    
    db.run(query, [userId], function(err) {
        if (err) {
            console.error("Error deleting user:", err);
            return res.status(500).send("Failed to delete user");
        }
        res.send("User deleted successfully");
    });
});

// Endpoint to delete content by ID
app.delete('/admin/deleteContent/:id', (req, res) => {
    const contentId = req.params.id;
    const category = req.query.category; // Get the category from the query parameter

    if (!category) {
        return res.status(400).json({ error: "Category is required" });
    }

    // SQL query to delete content from the specified category
    const query = `DELETE FROM ${category} WHERE id = ?`;

    db.query(query, [contentId], (err, result) => {
        if (err) {
            console.error("Error deleting content:", err);
            return res.status(500).json({ error: "Failed to delete content" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Content not found" });
        }

        res.json({ message: "Content deleted successfully" });
    });
});


// Endpoint to serve the material page
app.get('/materials/:category', (req, res) => {
    const category = req.params.category;
    console.log("category: ", category)
    // Validate the category input to prevent SQL injection
    const allowedCategories = ["geometry", "arithmetic", "algebra", "advancedMathematics", "worksheets", "funActivities"];
    if (!allowedCategories.includes(category)) {
        return res.status(400).json({ error: "Invalid category","Category": category });
    }

    // Serve the material page HTML
    res.sendFile(path.join(__dirname, 'materialPage/materialpage.html'));
});

app.get('/api/materials', (req, res) => {
    const category = req.query.category;

    // Validate the category input to prevent SQL injection
    const allowedCategories = ["geometry", "arithmetic", "algebra", "advancedMathematics", "worksheets", "funActivities"];
    if (!allowedCategories.includes(category)) {
        return res.status(400).json({ error: "Invalid category" });
    }

    // Query to fetch details
    const query = `SELECT id, filename, title, chapter, youtubeLink, description, file FROM ${category}`;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error retrieving content:", err);
            return res.status(500).json({ error: "Failed to retrieve content" });
        }
        res.json(results);
    });
});

app.get('/materials/pdf/:id', (req, res) => {
    const { id } = req.params;
    const category = req.query.category;

    if (!category) return res.status(400).send("Category is required");

    const query = `SELECT file, filename FROM ${category} WHERE id = ?`;
    db.query(query, [id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ error: "Failed to retrieve PDF" });
        }

        const fileBuffer = results[0].file;
        const filename = results[0].filename;

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${filename}"`,
        });

        res.send(fileBuffer);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});
