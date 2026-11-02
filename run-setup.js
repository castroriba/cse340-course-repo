import fs from 'fs';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setup() {
  try {
    const sql = fs.readFileSync('./src/setup.sql', 'utf8');
    await pool.query(sql);
    console.log('✅ Database setup completed successfully!');
  } catch (err) {
    console.error('❌ Error executing setup:', err);
  } finally {
    await pool.end();
  }
}

setup();