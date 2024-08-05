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

async function deleteAllData() {
    try {
        // Establish a connection to the database
        await client.connect();
        console.log('Connected to the database.');

        // Query to delete all data from the users table
        const query = 'DELETE FROM users';

        await client.query(query);

        console.log('All data deleted successfully.');

    } catch (error) {
        // Log any errors that occur during data deletion
        console.error('Error deleting all data:', error);
    } finally {
        // Close the client connection when done
        await client.end();
        console.log('Database connection closed.');
    }
}

deleteAllData();