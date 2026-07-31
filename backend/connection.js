import mysql from 'mysql2';
import { promisify } from 'util';
import { config } from './config/config.js';

const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: config.db.port,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    ssl: {
        rejectUnauthorized: false
    }
});

const exe = promisify(pool.query).bind(pool);

console.log("Database Pool Connected");

export { pool, exe };