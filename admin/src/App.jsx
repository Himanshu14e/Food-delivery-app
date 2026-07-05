import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeAdmin, setActiveAdmin] = useState(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('admin-auth');
    const admin = JSON.parse(localStorage.getItem('active-admin') || 'null');
    if (authStatus === 'true' && admin) {
      setIsAuthenticated(true);
      setActiveAdmin(admin);
    }
  }, []);

  const handleLogin = (admin) => {
    localStorage.setItem('admin-auth', 'true');
    localStorage.setItem('active-admin', JSON.stringify(admin));
    setActiveAdmin(admin);
    setIsAuthenticated(true);
  };

  const handleSignup = (admin) => {
    localStorage.setItem('admin-auth', 'true');
    localStorage.setItem('active-admin', JSON.stringify(admin));
    setActiveAdmin(admin);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    localStorage.removeItem('active-admin');
    setActiveAdmin(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path='/login' element={<Login onLogin={handleLogin} />} />
        <Route path='/signup' element={<Signup onSignup={handleSignup} />} />
        <Route path='*' element={<Login onLogin={handleLogin} />} />
      </Routes>
    );
  }

  return (
    <div className='admin-shell'>
      <ToastContainer />
      <Navbar onLogout={handleLogout} adminName={activeAdmin?.name || 'Admin'} />
      <div className="app-content">
        <Sidebar />
        <main className="main-view">
          <Routes>
            <Route path='/' element={<Dashboard url={url} />} />
            <Route path='/add' element={<Add url={url} />} />
            <Route path='/list' element={<List url={url} />} />
            <Route path='/orders' element={<Orders url={url} />} />
            <Route path='/login' element={<Navigate to='/' replace />} />
            <Route path='*' element={<Dashboard url={url} />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App