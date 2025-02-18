import mysql from 'mysql2';
import { config } from './config/config.js';
import { promisify } from 'util';  // Ensure to import 'util' for promisify

// Database connection setup
// Here using or db names are given becouse anyone who create database
const conn = mysql.createConnection({
    host: config.db.host || 'localhost',
    user: config.db.user || 'root',
    password: config.db.password || '',
    database: config.db.database || 'furni_shop'
});

// Connect to the database
conn.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Database connected successfully!');
});

// Promisify the query method for async/await use
const exe = promisify(conn.query).bind(conn);

// Export 'exe' for use in other files
export { exe };
