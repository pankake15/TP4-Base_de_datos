import express from 'express';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup for __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PostgreSQL client configuration
const { Client } = pg;
const connectionString = 'postgresql://tp_base_de_datos_la_secuela_user:xix0T1D43Xmkuiv5PbNCIJ695Xz9EhfV@dpg-cqqdv8bv2p9s73b65pvg-a.ohio-postgres.render.com/tp_base_de_datos_la_secuela?ssl=true';

const client = new Client({
    connectionString,
    connectionTimeoutMillis: 30000, // 30 seconds
    idle_in_transaction_session_timeout: 60000 // 60 seconds
});

// Connect to the database once and reuse the connection
client.connect().catch(error => console.error('Failed to connect to the database:', error));

const app = express();
const port = 3000;
app.use(express.json());

// Helper function to handle database queries
async function executeQuery(query, params = []) {
    try {
        const result = await client.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Database query failed:', error);
        throw error;
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/insert-default-data', async (req, res) => {
    const query = `
        INSERT INTO users (name, email) VALUES
        ('John Doe', 'john.doe@example.com'),
        ('Jane Smith', 'jane.smith@example.com'),
        ('Alice Johnson', 'alice.johnson@example.com')
        ON CONFLICT (email) DO NOTHING;
    `;
    try {
        await executeQuery(query);
        res.status(200).send('Default data inserted successfully.');
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.get('/read-data', async (req, res) => {
    const query = 'SELECT * FROM users';
    try {
        const data = await executeQuery(query);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.delete('/delete-data/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *;';
    try {
        const data = await executeQuery(query, [id]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.delete('/delete-all-data', async (req, res) => {
    const deleteQuery = 'DELETE FROM users';
    const resetSequenceQuery = "ALTER SEQUENCE users_id_seq RESTART WITH 1";

    try {
        await executeQuery(deleteQuery);
        await executeQuery(resetSequenceQuery);
        return 'All data deleted and ID sequence reset successfully.';
    } catch (error) {
        console.error('Failed to delete data and reset sequence:', error);
        throw error;
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
