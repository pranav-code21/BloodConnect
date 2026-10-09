require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

const PORT = 3000;

// Allow connections
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
// Connect to MySQL
db.connect((err) => {

    if (err) {

        console.log("MySQL connection failed:", err);

    } else {

        console.log("MySQL connected successfully!");

    }

});

// Frontend files serve karna
app.use(express.static(__dirname));

app.get("/", (req, res) => {

    res.sendFile(__dirname + "/index.html");

});

app.use(express.urlencoded({ extended: true }));


// Get all donors

app.get("/donors", (req, res) => {

    db.query("SELECT * FROM donors", (err, results) => {

        if (err) {

            res.status(500).send("Database error");

        } else {

            res.json(results);

        }

    });

});


// Dashboard Statistics

app.get("/dashboard-stats", (req, res) => {

    const bloodGroupQuery = `
        SELECT blood_group, COUNT(*) AS count
        FROM donors
        GROUP BY blood_group
    `;

    const locationQuery = `
        SELECT location, COUNT(*) AS count
        FROM donors
        GROUP BY location
    `;

    db.query(bloodGroupQuery, (err, bloodGroups) => {

        if (err) {

            console.log(err);

            return res.status(500).send(
                "Blood group statistics error"
            );

        }

        db.query(locationQuery, (err, locations) => {

            if (err) {

                console.log(err);

                return res.status(500).send(
                    "Location statistics error"
                );

            }

            res.json({
                bloodGroups: bloodGroups,
                locations: locations
            });

        });

    });

});


// Register donor

app.post("/register", (req, res) => {

    const {
        name,
        blood_group,
        location,
        phone,
        availability
    } = req.body;

    const sql =
        "INSERT INTO donors (name, blood_group, location, phone, availability) VALUES (?, ?, ?, ?, ?)";

    db.query(
        sql,
        [name, blood_group, location, phone, availability],
        (err, result) => {

            if (err) {

                console.log(err);

                if (err.code === "ER_DUP_ENTRY") {

                    res.status(409).send(
                        "Phone number already registered!"
                    );

                } else {

                    res.status(500).send(
                        "Registration failed"
                    );

                }

            } else {

                res.send(
                    "Donor registered successfully!"
                );

            }

        }
    );

});


// Update donor availability

app.post("/update-availability", (req, res) => {

    const {
        phone,
        availability
    } = req.body;

    const sql =
        "UPDATE donors SET availability = ? WHERE phone = ?";

    db.query(
        sql,
        [availability, phone],
        (err, result) => {

            if (err) {

                console.log(err);

                res.status(500).send(
                    "Unable to update availability"
                );

            } else if (result.affectedRows === 0) {

                res.status(404).send(
                    "Donor not found"
                );

            } else {

                res.send(
                    "Availability updated successfully!"
                );

            }

        }
    );

});


// Emergency Blood Request

app.post("/emergency-request", (req, res) => {

    const {
        patient_name,
        blood_group,
        location,
        phone,
        urgency
    } = req.body;

    const sql =
        "INSERT INTO emergency_requests (patient_name, blood_group, location, phone, urgency) VALUES (?, ?, ?, ?, ?)";

    db.query(
        sql,
        [
            patient_name,
            blood_group,
            location,
            phone,
            urgency
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                res.status(500).send(
                    "Blood request submission failed"
                );

            } else {

                res.send(
                    "Emergency blood request submitted successfully!"
                );

            }

        }
    );

});


// View Emergency Blood Requests

app.get("/emergency-requests", (req, res) => {

    db.query(
        "SELECT * FROM emergency_requests ORDER BY request_date DESC",
        (err, results) => {

            if (err) {

                console.log(err);

                res.status(500).send(
                    "Database error"
                );

            } else {

                res.json(results);

            }

        }
    );

});


// Start server

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});

