import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const isSsl = process.env.DB_SSL === 'true' || process.env.DB_SSL === 'REQUIRED';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 21970),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'defaultdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: isSsl ? { rejectUnauthorized: false } : undefined,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

export async function testConnection() {
  const connection = await pool.getConnection();
  try {
    const [threeRes] = await connection.query('SELECT 1 + 2 AS three');
    const [dbRes] = await connection.query('SELECT database() AS current_db');
    return {
      connected: true,
      three: threeRes[0].three,
      database: dbRes[0].current_db,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
    };
  } finally {
    connection.release();
  }
}

export default pool;
