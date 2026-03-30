-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS odontosys;
USE odontosys;

-- Eliminar tablas si existen (para evitar errores al reimportar)
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS users;

-- Crear tabla users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Crear tabla appointments
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  dentist_id INT,
  date DATETIME NOT NULL,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (dentist_id) REFERENCES users(id)
);

-- Crear tabla inventory
CREATE TABLE inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  unit VARCHAR(50) NOT NULL,
  min_stock INT NOT NULL
);

-- Crear tabla payments
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  amount DECIMAL(10,2) NOT NULL,
  description VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  date DATETIME NOT NULL,
  FOREIGN KEY (patient_id) REFERENCES users(id)
);

-- Insertar datos de prueba (Mock Data)
INSERT INTO users (id, name, email, role, password) VALUES
(1, 'Admin User', 'admin@odontosys.com', 'admin', 'password123'),
(2, 'Dr. Perez', 'perez@odontosys.com', 'dentist', 'password123'),
(3, 'Juan Paciente', 'juan@example.com', 'patient', 'password123');

INSERT INTO inventory (id, item_name, quantity, unit, min_stock) VALUES
(1, 'Resina Compuesta', 5, 'jeringas', 10),
(2, 'Anestesia Local', 50, 'cartuchos', 20),
(3, 'Guantes de Látex', 100, 'cajas', 15),
(4, 'Agujas Descartables', 200, 'unidades', 50);

INSERT INTO appointments (id, patient_id, dentist_id, date, status, notes) VALUES
(1, 3, 2, DATE_ADD(NOW(), INTERVAL 1 DAY), 'scheduled', 'Limpieza dental');

INSERT INTO payments (id, patient_id, amount, description, status, date) VALUES
(1, 3, 150.00, 'Limpieza Dental', 'pending', NOW()),
(2, 3, 500.00, 'Tratamiento de Conducto', 'paid', DATE_SUB(NOW(), INTERVAL 10 DAY));
