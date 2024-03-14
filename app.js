const express = require('express');
const bodyParser = require('body-parser');
const itemsRouter = require('./items');
const transactionsRouter = require('./transactions');

const app = express();

app.use(bodyParser.json());

// Mount the items router
app.use('/items', itemsRouter);

// Mount the transactions router at a different base path
app.use('/transactions', transactionsRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
