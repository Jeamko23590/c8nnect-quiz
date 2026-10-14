const { Pool } = require('pg');

// Parse DATABASE_URL or use individual connection parameters
const connectionString = process.env.DATABASE_URL;

let pool;

if (connectionString) {
  // Production: use DATABASE_URL from environment
  pool = new Pool({
    connectionString: connectionString,
    ssl: connectionString.includes('sslmode=require') ? {
      rejectUnauthorized: false
    } : false
  });
} else {
  // Development: use individual parameters
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'quizdb',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: false
  });
}

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
