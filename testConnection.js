const { Client } = require('pg');

const connectionString = 'postgresql://tp_base_de_datos_user:zERui0xpST8aaiOiFyYsK8dnEKaFwraK@dpg-cq60ud56l47c738sshag-a.ohio-postgres.render.com/tp_base_de_datos';

const client = new Client({
    connectionString,
});

async function testConnection() {
    try {
        await client.connect();
        console.log('Connection successful');
    } catch (error) {
        console.error('Connection error:', error);
    } finally {
        await client.end();
    }
}

testConnection();
