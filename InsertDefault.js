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

// Define an asynchronous function to insert default data into the users table
async function insertDefaultData() {
    try {
        console.log('Attempting to connect to the database...');
        // Establish a connection to the database
        await client.connect();
        console.log('Connected to the database.');

        // Insert default data into the users table
        const query = `
            INSERT INTO users (name, email) VALUES
            ('John Doe', 'john.doefhdfh@example.com'),
            ('Jane Smith', 'jane.smithdfhdfh@example.com'),
            ('Alice Johnson', 'alice.johnsodfghn@example.com')
            ON CONFLICT (email) DO NOTHING; -- Ignore duplicates based on email
        `;

        await client.query(query);

        console.log('Default data inserted successfully.');
    } catch (error) {
        // Log any errors that occur during data insertion
        console.error('Error inserting data:', error);
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

// Call the function to insert default data
insertDefaultData();
