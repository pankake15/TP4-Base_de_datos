import pg from 'pg';
import readline from 'readline'; 

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
            ('John Doe', 'john.dohern@example.com'),
            ('Jane Smith', 'jane.smith@example.com'),
            ('Alice Johnson', 'alice.johnson@example.com')
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
    }
}

// Define an asynchronous function to read data from the users table
async function readData() {
    try {

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
        
    }
}

async function deleteData(id) {
    try {

        console.log('Connected to the database.');

        // Query to delete data from the users table
        const query = `
            DELETE FROM users
            WHERE id = $1
            RETURNING *;
        `;
        
        const result = await client.query(query, [id]);

        if (result.rows.length > 0) {
            console.log('Data deleted successfully:');
            console.table(result.rows);
        } else {
            console.log('No data found with the provided id.');
        }

    } catch (error) {
        // Log any errors that occur during data deletion
        console.error('Error deleting data:', error);
    } finally {
        // Close the client connection when done
        await client.end();
        console.log('Database connection closed.');
    }
}

// Function to prompt the user for input and delete a record
async function promptAndDelete() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the ID of the user you want to delete: ', async (id) => {
        await deleteData(id);
        rl.close();
    });
}

// Call the function to insert default data, then read data, and prompt for deletion
insertDefaultData().then(() => {
    readData().then(() => {
        // Prompt user to delete a record
        promptAndDelete();
    });
});