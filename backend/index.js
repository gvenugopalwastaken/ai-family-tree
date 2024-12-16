const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const db = new sqlite3.Database("./data/family_tree.db");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Root route to prevent "Cannot GET /" error
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Route to fetch all family data (persons and relationships)
app.get("/family-tree", (req, res) => {
  db.all("SELECT * FROM persons", (err, persons) => {
    if (err) {
      return res.status(500).send("Error fetching persons data.");
    }

    // Fetch relationships data
    db.all("SELECT * FROM relationships", (err, relationships) => {
      if (err) {
        return res.status(500).send("Error fetching relationships data.");
      }

      res.json({ persons, relationships });
    });
  });
});

// Route to insert new persons into the database
app.post("/add-person", (req, res) => {
  const { name, birthdate, email } = req.body;

  // Insert the person into the database
  const query = "INSERT INTO persons (name, birthdate, email) VALUES (?, ?, ?)";
  db.run(query, [name, birthdate, email], function (err) {
    if (err) {
      return res.status(500).send("Error inserting person data.");
    }

    res.status(200).send({ message: "Person added successfully!", id: this.lastID });
  });
});

// Route to insert a new relationship into the database
app.post("/add-relationship", (req, res) => {
  const { person1_id, person2_id, relationship_type } = req.body;

  // Insert the relationship into the database
  const query = "INSERT INTO relationships (person1_id, person2_id, relationship_type) VALUES (?, ?, ?)";
  db.run(query, [person1_id, person2_id, relationship_type], function (err) {
    if (err) {
      return res.status(500).send("Error inserting relationship data.");
    }

    res.status(200).send({ message: "Relationship added successfully!", id: this.lastID });
  });
});

// Start the server
app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});
