import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import mysql from 'mysql2/promise';

const PORT = 3000;

// Database Abstraction Layer
let dbQuery: (sql: string, params?: any[]) => Promise<any[]>;
let dbExecute: (sql: string, params?: any[]) => Promise<any>;

const useMySQL = !!process.env.MYSQL_HOST;

// Mock Data Fallback
const mockData = {
  users: [
    { id: 1, name: 'Admin User', email: 'admin@odontosys.com', role: 'admin', password: 'password123' },
    { id: 2, name: 'Dr. Perez', email: 'perez@odontosys.com', role: 'dentist', password: 'password123' },
    { id: 3, name: 'Juan Paciente', email: 'juan@example.com', role: 'patient', password: 'password123' }
  ],
  inventory: [
    { id: 1, item_name: 'Resina Compuesta', quantity: 5, unit: 'jeringas', min_stock: 10 },
    { id: 2, item_name: 'Anestesia Local', quantity: 50, unit: 'cartuchos', min_stock: 20 },
    { id: 3, item_name: 'Guantes de Látex', quantity: 100, unit: 'cajas', min_stock: 15 },
    { id: 4, item_name: 'Agujas Descartables', quantity: 200, unit: 'unidades', min_stock: 50 }
  ],
  appointments: [
    { id: 1, patient_id: 3, dentist_id: 2, date: new Date(Date.now() + 86400000).toISOString(), status: 'scheduled', notes: 'Limpieza dental' }
  ],
  payments: [
    { id: 1, patient_id: 3, amount: 150.00, description: 'Limpieza Dental', status: 'pending', date: new Date().toISOString() },
    { id: 2, patient_id: 3, amount: 500.00, description: 'Tratamiento de Conducto', status: 'paid', date: new Date(Date.now() - 864000000).toISOString() }
  ]
};

async function initDB() {
  let connected = false;

  if (process.env.MYSQL_HOST && process.env.MYSQL_HOST !== '127.0.0.1' && process.env.MYSQL_HOST !== 'localhost') {
    try {
      console.log("Connecting to MySQL...");
      const pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      // Test connection
      await pool.query('SELECT 1');

      dbQuery = async (sql, params) => { const [rows] = await pool.query(sql, params); return rows as any[]; };
      dbExecute = async (sql, params) => { const [result] = await pool.execute(sql, params); return result; };

      // Initialize tables if they don't exist
      await dbExecute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          role VARCHAR(50) NOT NULL,
          password VARCHAR(255) NOT NULL
        )
      `);
      await dbExecute(`
        CREATE TABLE IF NOT EXISTS appointments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          patient_id INT,
          dentist_id INT,
          date DATETIME NOT NULL,
          status VARCHAR(50) NOT NULL,
          notes TEXT,
          FOREIGN KEY (patient_id) REFERENCES users(id),
          FOREIGN KEY (dentist_id) REFERENCES users(id)
        )
      `);
      await dbExecute(`
        CREATE TABLE IF NOT EXISTS inventory (
          id INT AUTO_INCREMENT PRIMARY KEY,
          item_name VARCHAR(255) NOT NULL,
          quantity INT NOT NULL,
          unit VARCHAR(50) NOT NULL,
          min_stock INT NOT NULL
        )
      `);
      await dbExecute(`
        CREATE TABLE IF NOT EXISTS payments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          patient_id INT,
          amount DECIMAL(10,2) NOT NULL,
          description VARCHAR(255) NOT NULL,
          status VARCHAR(50) NOT NULL,
          date DATETIME NOT NULL,
          FOREIGN KEY (patient_id) REFERENCES users(id)
        )
      `);
      connected = true;
      console.log("Successfully connected to MySQL and initialized tables.");
    } catch (error) {
      console.error("MySQL connection failed, falling back to mock DB:", error);
    }
  }

  if (!connected) {
    console.log("Using Mock DB for preview.");
    dbQuery = async (sql, params) => {
      // Very basic mock query parser for preview purposes
      if (sql.includes('FROM users WHERE email = ?')) {
        return mockData.users.filter(u => u.email === params?.[0] && u.password === params?.[1]);
      }
      if (sql.includes('FROM users')) return mockData.users;
      if (sql.includes('FROM inventory')) return mockData.inventory;
      if (sql.includes('FROM appointments')) {
        return mockData.appointments.map(a => ({
          ...a,
          patient_name: mockData.users.find(u => u.id === a.patient_id)?.name,
          dentist_name: mockData.users.find(u => u.id === a.dentist_id)?.name
        }));
      }
      if (sql.includes('FROM payments')) {
        return mockData.payments.filter(p => p.patient_id === Number(params?.[0]));
      }
      return [];
    };
    dbExecute = async (sql, params) => {
      if (sql.includes('INSERT INTO appointments')) {
        const id = mockData.appointments.length + 1;
        mockData.appointments.push({ id, patient_id: params?.[0], dentist_id: params?.[1], date: params?.[2], status: params?.[3], notes: params?.[4] });
        return { insertId: id };
      }
      if (sql.includes('UPDATE payments')) {
        const payment = mockData.payments.find(p => p.id === params?.[0]);
        if (payment) payment.status = 'paid';
        return { affectedRows: 1 };
      }
      return {};
    };
  }
}

async function startServer() {
  await initDB();
  const app = express();
  
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Users API
  app.get('/api/users', async (req, res) => {
    try {
      const users = await dbQuery('SELECT id, name, email, role FROM users');
      res.json(users);
    } catch (e) { res.status(500).json({error: 'DB error'}); }
  });

  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const users = await dbQuery('SELECT id, name, email, role FROM users WHERE email = ? AND password = ?', [email, password]);
      if (users && users.length > 0) {
        res.json({ user: users[0], token: 'mock-jwt-token' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (e) { res.status(500).json({error: 'DB error'}); }
  });

  // Appointments API
  app.get('/api/appointments', async (req, res) => {
    try {
      const appointments = await dbQuery(`
        SELECT a.*, p.name as patient_name, d.name as dentist_name 
        FROM appointments a
        LEFT JOIN users p ON a.patient_id = p.id
        LEFT JOIN users d ON a.dentist_id = d.id
      `);
      res.json(appointments);
    } catch (e) { res.status(500).json({error: 'DB error'}); }
  });

  app.post('/api/appointments', async (req, res) => {
    const { patient_id, dentist_id, date, status, notes } = req.body;
    try {
      const info = await dbExecute('INSERT INTO appointments (patient_id, dentist_id, date, status, notes) VALUES (?, ?, ?, ?, ?)', [patient_id, dentist_id, date, status, notes]);
      res.json({ id: info.insertId });
    } catch (e) { res.status(500).json({error: 'DB error'}); }
  });

  // Inventory API
  app.get('/api/inventory', async (req, res) => {
    try {
      const items = await dbQuery('SELECT * FROM inventory');
      res.json(items);
    } catch (e) { res.status(500).json({error: 'DB error'}); }
  });

  // Payments API
  app.get('/api/payments', async (req, res) => {
    try {
      const payments = await dbQuery('SELECT * FROM payments WHERE patient_id = ?', [req.query.patient_id]);
      res.json(payments);
    } catch (e) { res.status(500).json({error: 'DB error'}); }
  });

  app.post('/api/payments/pay', async (req, res) => {
    try {
      await dbExecute('UPDATE payments SET status = "paid" WHERE id = ?', [req.body.payment_id]);
      res.json({ success: true });
    } catch (e) { res.status(500).json({error: 'DB error'}); }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
