// let promise = require('bluebird');
// let options = {
//     promiseLib: promise
// };

// let pgp = require('pg-promise')(options);

// //const connectString = 'postgres://postgres:1234@localhost/recaudaciones';
// //const urlconnection = 'postgres://modulo4@sigap.postgres.database.azure.com:modulo4@sigap.postgres.database.azure.com:5432/tcs';
// const urlconnection = 'postgres://modulo4:modulo4d@159.65.230.188:5432/tcs2';
// let cn = pgp(urlconnection);


const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://modulo4:modulo4d@159.65.230.188:5432/tcs2';

const client = new pg.Client(connectionString);
client.connect();

module.exports = client;