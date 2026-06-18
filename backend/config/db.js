const { Pool } = require('pg');
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const pool = process.env.DATABASE_URL
    ? new Pool({
        conectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false}
    })
    : new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
});

module.exports = pool;