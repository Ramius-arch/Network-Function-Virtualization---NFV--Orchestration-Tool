import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const connectDB = async () => {
  if (process.env.MOCK_DATA === 'true') {
    console.log('Skipping database connection as MOCK_DATA is enabled.');
    return;
  }
  try {
    await pool.connect();
    console.log('PostgreSQL connected');
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    process.exit(1);
  }
};

export default pool;
