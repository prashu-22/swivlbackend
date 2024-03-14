// items.js
const express = require('express');
const router = express.Router();
const db = require('./database');

// GET /items: Retrieve a list of all items
router.get('/', (req, res) => {
    db.all('SELECT * FROM items', (err, rows) => {
        if (err) {
            console.error('Error retrieving items:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(rows);
    });
});

// POST /items: Add a new item to the inventory
router.post('/', (req, res) => {
    const { name, description, quantity } = req.body;

    // Validate request body
    if (!name || !quantity || quantity < 0) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    db.run('INSERT INTO items (name, description, quantity) VALUES (?, ?, ?)', [name, description, quantity], function(err) {
        if (err) {
            console.error('Error adding item:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ id: this.lastID });
    });
});

// GET /items/:id: Retrieve a specific item by its id
router.get('/:id', (req, res) => {
    const itemId = req.params.id;
    db.get('SELECT * FROM items WHERE id = ?', [itemId], (err, row) => {
        if (err) {
            console.error('Error retrieving item:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(row);
    });
});

// PUT /items/:id: Update a specific item by its id
router.put('/:id', (req, res) => {
    const itemId = req.params.id;
    const { name, description, quantity } = req.body;

    // Validate request body
    if (!name || !quantity || quantity < 0) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    db.run('UPDATE items SET name = ?, description = ?, quantity = ? WHERE id = ?', [name, description, quantity, itemId], (err) => {
        if (err) {
            console.error('Error updating item:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Item updated successfully' });
    });
});

// DELETE /items/:id: Remove a specific item from the inventory
router.delete('/:id', (req, res) => {
    const itemId = req.params.id;
    db.run('DELETE FROM items WHERE id = ?', [itemId], (err) => {
        if (err) {
            console.error('Error deleting item:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Item deleted successfully' });
    });
});

module.exports = router;
