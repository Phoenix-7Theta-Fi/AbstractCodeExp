// AbstractSnippet: DB001
// --- SQLite Database Initialization and Configuration ---
import Database from 'better-sqlite3'; // Import the better-sqlite3 library
import fs from 'fs'; // Import Node.js file system module
import path from 'path'; // Import Node.js path module

// Step 1: Define the path for the SQLite database file within a 'data' directory
const dbPath = path.join(process.cwd(), 'data', 'sqlite.db');

// Step 2: Ensure the 'data' directory exists, create it if it doesn't
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    console.log(`Creating data directory at: ${dataDir}`);
    fs.mkdirSync(dataDir, { recursive: true }); // Use recursive true for safety
}

// Step 3: Initialize the database connection using the defined path
// This will create the .db file if it doesn't exist
console.log(`Initializing database connection at: ${dbPath}`);
const db = new Database(dbPath, { verbose: console.log }); // Added verbose logging

// Step 4: Enable Foreign Key support in SQLite
db.pragma('foreign_keys = ON');
// Step 5: Enable Write-Ahead Logging (WAL) mode for better concurrency and performance
db.pragma('journal_mode = WAL');
console.log('Enabled foreign keys and WAL mode.');

// Step 6: Read the database schema definition from the SQL file
const schemaPath = path.join(process.cwd(), 'src', 'lib', 'db', 'schema.sql');
console.log(`Reading schema from: ${schemaPath}`);
const schema = fs.readFileSync(schemaPath, 'utf8');

// Step 7: Execute the schema SQL to create tables if they don't exist
// This ensures the database structure is up-to-date on application start
console.log('Executing database schema...');
db.exec(schema);
console.log('Database schema executed successfully.');

// Step 8: Export the initialized and configured database connection instance
export default db;
