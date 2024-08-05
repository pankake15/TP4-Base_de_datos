import express from 'express';
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

// Initialize Express app
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define an asynchronous function to insert default data into the users table
async function insertDefaultData() {
    try {
        await client.connect();
        const query = `
            INSERT INTO users (name, email) VALUES
            ('John Doe', 'john.doherngsgdgs@example.com'),
            ('Jane Smith', 'jane.smithsdgdsfg@example.com'),
            ('Alice Johnson', 'alice.johnsogsdfgdn@example.com')
            ON CONFLICT (email) DO NOTHING;
        `;
        await client.query(query);
        return 'Default data inserted successfully.';
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
}

// Define an asynchronous function to read data from the users table
async function readData() {
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM users');
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
}

// Define an asynchronous function to delete data by id from the users table
async function deleteData(id) {
    try {
        await client.connect();
        const query = 'DELETE FROM users WHERE id = $1 RETURNING *;';
        const result = await client.query(query, [id]);
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
}

// Define an asynchronous function to delete all data from the users table
async function deleteAllData() {
    try {
        await client.connect();
        const query = 'DELETE FROM users';
        await client.query(query);
        return 'All data deleted successfully.';
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
}

// Define routes
app.post('/insert-default-data', async (req, res) => {
    try {
        const message = await insertDefaultData();
        res.status(200).send(message);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.get('/read-data', async (req, res) => {
    try {
        const data = await readData();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.delete('/delete-data/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const data = await deleteData(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.delete('/delete-all-data', async (req, res) => {
    try {
        const message = await deleteAllData();
        res.status(200).send(message);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

