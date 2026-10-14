const { Pool } = require('pg');

let initialized = false;
let pool;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    pool = new Pool({
      connectionString: connectionString,
      ssl: connectionString.includes('sslmode=require') ? {
        rejectUnauthorized: false
      } : false
    });
  }
  return pool;
}

async function initializeDatabase() {
  if (initialized) return;
  
  const pool = getPool();
  
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS question (
        id SERIAL PRIMARY KEY,
        question_text TEXT NOT NULL,
        option_a VARCHAR(255) NOT NULL,
        option_b VARCHAR(255) NOT NULL,
        option_c VARCHAR(255) NOT NULL,
        option_d VARCHAR(255) NOT NULL,
        correct_answer CHAR(1) NOT NULL,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS quiz_attempt (
        id SERIAL PRIMARY KEY,
        nickname VARCHAR(100) NOT NULL,
        score INTEGER NOT NULL,
        time_used_seconds INTEGER NOT NULL,
        attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_quiz_attempt_score ON quiz_attempt(score DESC, time_used_seconds ASC);
      CREATE INDEX IF NOT EXISTS idx_quiz_attempt_date ON quiz_attempt(attempt_date DESC);
    `);

    // Insert sample questions if table is empty
    const countResult = await pool.query('SELECT COUNT(*) FROM question');
    if (parseInt(countResult.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO question (question_text, option_a, option_b, option_c, option_d, correct_answer)
        VALUES
          ('What is the primary purpose of a Point-of-Sale (POS) system?', 'Track employee attendance', 'Process sales transactions', 'Manage customer appointments', 'Send marketing emails', 'B'),
          ('Which system would a retail store use to track stock levels and reorder products automatically?', 'Customer Relationship Management (CRM)', 'Inventory Management System', 'Payroll System', 'Accounting System', 'B'),
          ('What type of information system would a salon use to schedule client appointments?', 'Appointment Booking System', 'Learning Management System', 'Payroll System', 'Inventory System', 'A'),
          ('Which system allows customers to place orders for food or products through a website or mobile app?', 'Point-of-Sale System', 'Online Ordering System', 'Helpdesk System', 'HRMS', 'B'),
          ('What is the main function of a Customer Relationship Management (CRM) system?', 'Process payroll for employees', 'Manage and analyze customer interactions and data', 'Track inventory levels', 'Create financial reports', 'B'),
          ('Which system would a company use to calculate employee salaries, deductions, and tax withholdings?', 'CRM System', 'Payroll System', 'LMS', 'POS System', 'B'),
          ('What type of system would a school or training center use to deliver online courses and track student progress?', 'Customer Support System', 'Learning Management System (LMS)', 'Inventory Management System', 'Accounting System', 'B'),
          ('Which system helps businesses manage customer inquiries, complaints, and support tickets?', 'POS System', 'Customer Support/Helpdesk System', 'Payroll System', 'Online Ordering System', 'B'),
          ('What is the primary use of an Accounting System in a business?', 'Schedule employee shifts', 'Manage financial transactions and generate reports', 'Track customer orders', 'Process sales transactions', 'B'),
          ('Which system would a large organization use to manage employee records, benefits, and performance reviews?', 'Inventory Management System', 'Point-of-Sale System', 'Human Resource Management System (HRMS)', 'Learning Management System', 'C')
      `);
    }
    
    initialized = true;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

module.exports = { initializeDatabase, getPool };
