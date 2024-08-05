import pg from 'pg';

// Destructure Client class from the pg module
const { Client } = pg;

// Define the connection string to connect to the PostgreSQL database
const connectionString = 'postgresql://tp_base_de_datos_user:zERui0xpST8aaiOiFyYsK8dnEKaFwraK@dpg-cq60ud56l47c738sshag-a.ohio-postgres.render.com/tp_base_de_datos?ssl=true';

// Create a new Client instance with the connection string and increased timeout settings
const client = new Client({
    connectionString,
    connectionTimeoutMillis: 30000, // 30 seconds
    idle_in_transaction_session_timeout: 60000 // 60 seconds
});

// Define an asynchronous function to read data from the users table
async function readData() {
    try {
        console.log('Attempting to connect to the database...');
        // Establish a connection to the database
        await client.connect();
        console.log('Connected to the database.');
        // Query to retrieve data from the users table
        const result = await client.query('SELECT * FROM users');

        // Log the retrieved data
        console.log('Data retrieved from the database:');
        console.table(result.rows); // Using console.table for better readability

    } catch (error) {
        // Log any errors that occur during data retrieval
        console.error('Error reading data:', error);
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


    readData();