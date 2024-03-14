// transactions.js

const express = require('express');
const router = express.Router();
const db = require('./database');

// POST /items/:id/transaction: Record a transaction for a specific item
router.post('/:id/transaction', (req, res) => {
    const itemId = req.params.id;
    const { type, quantity } = req.body;

    // Validate request body
    if (!type || !quantity || quantity < 0) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    db.run('INSERT INTO transactions (item_id, type, quantity) VALUES (?, ?, ?)', [itemId, type, quantity], function(err) {
        if (err) {
            console.error('Error recording transaction:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ id: this.lastID });
    });
});

// GET /items/:id/transactions: Retrieve all transactions for a specific item
router.get('/:id/transactions', (req, res) => {
    const itemId = req.params.id;
    db.all('SELECT * FROM transactions WHERE item_id = ?', [itemId], (err, rows) => {
        if (err) {
            console.error('Error retrieving transactions:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(rows);
    });
});

module.exports = router;
