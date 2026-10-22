const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const path = require('path');

// Create express app
const app = express();
const port = process.env.PORT || 3000;

// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

// Add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});
	 	 	 	
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM teammembers;');

        res.render('user', {
            teammembers: result.rows
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Database error');
    }
});
app.get('/user', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM teammembers;');

        const teammembers = result.rows;
        const data = { teammembers: teammembers };

        console.log(teammembers);
        res.render('user', data);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Failed to load team members');
    }
});

app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.send('PostgreSQL connected successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Database connection failed');
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
