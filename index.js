//  git config --global user.email "diegospitale5@gmail.com"
//  git config --global user.name "pankake15"

import pg from 'pg';
//.
// Destructure Client class from the pg module
const { Client } = pg;

// Define the connection string to connect to the PostgreSQL database
const connectionString = 'postgresql://tp_base_de_datos_la_secuela_user:xix0T1D43Xmkuiv5PbNCIJ695Xz9EhfV@dpg-cqqdv8bv2p9s73b65pvg-a.ohio-postgres.render.com/tp_base_de_datos_la_secuela?ssl=true';

// Create a new Client instance with the connection string and increased timeout settings
const client = new Client({
    connectionString,
    connectionTimeoutMillis: 30000, // 30 seconds
    idle_in_transaction_session_timeout: 60000 // 60 seconds
});

// Define an asynchronous function to create a table using a single client connection
async function createTableWithClient() {
    try {
        console.log('Attempting to connect to the database...');
        // Establish a connection to the database
        await client.connect();
        console.log('Connected to the database.');

        // Execute the SQL query to create the table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,          -- Auto-incrementing primary key
                name VARCHAR(100) NOT NULL,     -- Name column, cannot be null
                email VARCHAR(100) UNIQUE NOT NULL, -- Email column, must be unique and not null
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp column with default value of current time
            )
        `);

        console.log('Table "users" created successfully.');
    } catch (error) {
        // Log any errors that occur during table creation
        console.error('Error creating table:', error);
        if (error.code === 'ECONNRESET') {
            console.error('Connection was reset by the server. Please check your network connection and database server.');
        } else if (error.code === '28P01') {
            console.error('Invalid authentication. Please check your username and password.');
        } else {
            console.error('An unexpected error occurred:', error.message);
        }
    } finally {
        // Close the client connection when done
        await client.end();
        console.log('Database connection closed.');
    }
}

// Call the function to create the table
createTableWithClient();