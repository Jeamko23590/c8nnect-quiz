const pool = require('./config');

const createTablesQuery = `
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
`;

const sampleQuestionsQuery = `
  INSERT INTO question (question_text, option_a, option_b, option_c, option_d, correct_answer)
  SELECT * FROM (VALUES
    ('What is the primary purpose of a Point-of-Sale (POS) system?', 
     'Track employee attendance', 
     'Process sales transactions', 
     'Manage customer appointments', 
     'Send marketing emails', 
     'B'),
    
    ('Which system would a retail store use to track stock levels and reorder products automatically?', 
     'Customer Relationship Management (CRM)', 
     'Inventory Management System', 
     'Payroll System', 
     'Accounting System', 
     'B'),
    
    ('What type of information system would a salon use to schedule client appointments?', 
     'Appointment Booking System', 
     'Learning Management System', 
     'Payroll System', 
     'Inventory System', 
     'A'),
    
    ('Which system allows customers to place orders for food or products through a website or mobile app?', 
     'Point-of-Sale System', 
     'Online Ordering System', 
     'Helpdesk System', 
     'HRMS', 
     'B'),
    
    ('What is the main function of a Customer Relationship Management (CRM) system?', 
     'Process payroll for employees', 
     'Manage and analyze customer interactions and data', 
     'Track inventory levels', 
     'Create financial reports', 
     'B'),
    
    ('Which system would a company use to calculate employee salaries, deductions, and tax withholdings?', 
     'CRM System', 
     'Payroll System', 
     'LMS', 
     'POS System', 
     'B'),
    
    ('What type of system would a school or training center use to deliver online courses and track student progress?', 
     'Customer Support System', 
     'Learning Management System (LMS)', 
     'Inventory Management System', 
     'Accounting System', 
     'B'),
    
    ('Which system helps businesses manage customer inquiries, complaints, and support tickets?', 
     'POS System', 
     'Customer Support/Helpdesk System', 
     'Payroll System', 
     'Online Ordering System', 
     'B'),
    
    ('What is the primary use of an Accounting System in a business?', 
     'Schedule employee shifts', 
     'Manage financial transactions and generate reports', 
     'Track customer orders', 
     'Process sales transactions', 
     'B'),
    
    ('Which system would a large organization use to manage employee records, benefits, and performance reviews?', 
     'Inventory Management System', 
     'Point-of-Sale System', 
     'Human Resource Management System (HRMS)', 
     'Learning Management System', 
     'C')
  ) AS v(question_text, option_a, option_b, option_c, option_d, correct_answer)
  WHERE NOT EXISTS (SELECT 1 FROM question LIMIT 1);
`;

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    console.log('Initializing database...');
    
    // Create tables
    await client.query(createTablesQuery);
    console.log('✓ Database tables created/verified');
    
    // Insert sample questions
    await client.query(sampleQuestionsQuery);
    console.log('✓ Sample questions inserted/verified');
    
    // Verify data
    const countResult = await client.query('SELECT COUNT(*) FROM question');
    console.log(`✓ Database initialized with ${countResult.rows[0].count} questions`);
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { initializeDatabase };
