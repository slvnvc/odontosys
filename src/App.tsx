import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Inventory from './pages/admin/Inventory';
import Reports from './pages/admin/Reports';
import DentistDashboard from './pages/dentist/Dashboard';
import Patients from './pages/dentist/Patients';
import Records from './pages/dentist/Records';
import PatientDashboard from './pages/patient/Dashboard';
import History from './pages/patient/History';
import Payments from './pages/patient/Payments';
import Layout from './components/Layout';

export default function App() {
  const [user, setUser] = useState<{ id: number; name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        
        <Route path="/" element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
          {user?.role === 'admin' && (
            <>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="reports" element={<Reports />} />
            </>
          )}
          {user?.role === 'dentist' && (
            <>
              <Route index element={<DentistDashboard user={user} />} />
              <Route path="patients" element={<Patients />} />
              <Route path="records" element={<Records />} />
            </>
          )}
          {user?.role === 'patient' && (
            <>
              <Route index element={<PatientDashboard user={user} />} />
              <Route path="history" element={<History />} />
              <Route path="payments" element={<Payments user={user} />} />
            </>
          )}
        </Route>
      </Routes>
    </Router>
  );
}
