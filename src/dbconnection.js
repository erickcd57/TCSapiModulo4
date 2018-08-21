const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://modulo4:modulo4d@159.65.230.188:5432/tcs2';

const client = new pg.Client(connectionString);
client.connect();

module.exports = client;