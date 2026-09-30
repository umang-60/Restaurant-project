const express = require('express');
const cors = require('cors');
const db = require('./db'); // Imports your new MySQL Workbench connection configuration package
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configuration setup
app.use(cors());
app.use(express.json());

// 📊 @route   GET /api/foods
// @desc    Retrieve all food entries dynamically from MySQL Workbench DB
app.get('/api/foods', async (req, res) => {
    try {
        // Execute the relational selection query statement across the structural tables
        const [rows] = await db.query('SELECT * FROM foods ORDER BY id DESC');
        res.status(200).json(rows);
    } catch (error) {
        console.error("Database query extraction failure:", error);
        res.status(500).json({ message: "Failed to fetch items from database" });
    }
});

// 📥 @route   POST /api/foods
// @desc    Insert a unique food item row straight into the live MySQL tables
app.post('/api/foods', async (req, res) => {
    const { name, price, category, description } = req.body;

    // Server-Side Field Validation Engine Rules
    if (!name || !price || !category || !description) {
        return res.status(400).json({ message: "please fill up all fields" });
    }
    if (isNaN(price) || Number(price) <= 0) {
        return res.status(400).json({ message: "Please enter a valid price" });
    }

    try {
        // Run SQL insertion string statement inside pool engine
        const sql = 'INSERT INTO foods (name, price, category, description) VALUES (?, ?, ?, ?)';
        await db.query(sql, [name, price, category, description]);

        res.status(201).json({
            message: "Food added successfully to MySQL Database!",
            data: { name, price, category, description }
        });
    } catch (error) {
        console.error("Database table row insertion processing failure:", error);
        res.status(500).json({ message: "Failed to save item to database" });
    }
});
// 🗑️ @route   DELETE /api/foods/:id
// @desc    Delete a food item from MySQL DB by its unique id column
app.delete('/api/foods/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM foods WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Food item not found" });
        }
        
        res.status(200).json({ message: "Food deleted successfully from database!" });
    } catch (error) {
        console.error("Database deletion processing failure:", error);
        res.status(500).json({ message: "Failed to delete item from database" });
    }
});

// 📝 @route   PUT /api/foods/:id
// @desc    Update an existing food item row inside MySQL DB by its unique id
app.put('/api/foods/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, category, description } = req.body;

    if (!name || !price || !category || !description) {
        return res.status(400).json({ message: "please fill up all fields" });
    }
    if (isNaN(price) || Number(price) <= 0) {
        return res.status(400).json({ message: "Please enter a valid price" });
    }

    try {
        const sql = 'UPDATE foods SET name = ?, price = ?, category = ?, description = ? WHERE id = ?';
        const [result] = await db.query(sql, [name, price, category, description, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Food item not found" });
        }

        res.status(200).json({ message: "Food updated successfully inside database!" });
    } catch (error) {
        console.error("Database row modification processing failure:", error);
        res.status(500).json({ message: "Failed to update item inside database" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} with active MySQL pipeline connection`);
});
