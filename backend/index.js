const express = require('express');
const dotenv = require('dotenv');


dotenv.config();

const app = express();

app.use(express.json());

const pool = require('./config/db');

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected at:', res.rows[0].now);
    }
});

app.get('/', (req, res) => {
    res.json({ message: 'Immerly API is running' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

