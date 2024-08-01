import pg from 'pg';

// Destructure Client class from the pg module
const { Client } = pg;

// Define the connection string to connect to the PostgreSQL database
const connectionString = 'postgresql://tp_base_de_datos_user:zERui0xpST8aaiOiFyYsK8dnEKaFwraK@dpg-cq60ud56l47c738sshag-a.ohio-postgres.render.com/tp_base_de_datos';

// Create a new Client instance with the connection string
const client = new Client({
    connectionString,
});

// Define an asynchronous function to create a table using a single client connection
async function createTableWithClient() {
    try {
        // Establish a connection to the database
        await client.connect();

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
    } finally {
        // Close the client connection when done
        await client.end();
    }
}

// Call the function to create the table
createTableWithClient();
