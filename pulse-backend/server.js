const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000; // You can change this if needed

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "adminCK",        // or your MySQL username
  password: "Pulse@horizon6",        // add your MySQL password if you set one
  database: "pulse" // your database name
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database.");
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Fetch all products
app.get("/api/products", (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error fetching products");
      }
      res.json(results);
    });
  });
  
  // Place an order
app.post("/api/orders", (req, res) => {
    const { product_id, name, email, phone, proof } = req.body;
  
    if (!product_id || !name) {
      return res.status(400).send("Missing required fields");
    }
  
    db.query(
      "INSERT INTO orders (product_id, name, email, phone, proof) VALUES (?, ?, ?, ?, ?)",
      [product_id, name, email, phone, proof],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error placing order");
        }
        res.status(201).send("Order placed successfully!");
      }
    );
  });
  

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
