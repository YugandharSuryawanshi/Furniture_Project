import mysql from 'mysql2';
import { config } from './config/config.js';
import { promisify } from 'util';  // Ensure to import 'util' for promisify

// Database connection setup
const conn = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
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
