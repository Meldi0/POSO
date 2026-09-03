import { testConnection, pool } from '../config/db.js';

async function run() {
  console.log('--- UJI KONEKSI AIVEN MYSQL (POSO) ---');
  try {
    const result = await testConnection();
    console.log('Status      : Terhubung (CONNECTED)');
    console.log('Query 1+2   :', result.three, '(Expected: 3)');
    console.log('Database    :', result.database, '(Expected: defaultdb)');
    console.log('Host        :', result.host);
    console.log('Port        :', result.port);
    console.log('SSL Mode    : REQUIRED (Active)');
    console.log('--------------------------------------');
    process.exit(0);
  } catch (err) {
    console.error('FAILED TO CONNECT TO AIVEN MYSQL:', err.message);
    console.error(err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
