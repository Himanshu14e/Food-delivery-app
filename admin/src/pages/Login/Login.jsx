import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    const savedAdmins = JSON.parse(localStorage.getItem('admin-users') || '[]');
    const envAdmin = import.meta.env.VITE_ADMIN_EMAIL && import.meta.env.VITE_ADMIN_PASSWORD
      ? { email: import.meta.env.VITE_ADMIN_EMAIL, password: import.meta.env.VITE_ADMIN_PASSWORD }
      : null;
    const fallbackAdmin = { name: 'Admin', email: 'admin@example.com', password: 'admin1234' };

    const matchingAdmin = savedAdmins.find(
      (admin) => admin?.email?.toLowerCase() === trimmedEmail && admin.password === password
    );

    if (matchingAdmin) {
      onLogin(matchingAdmin);
      navigate('/');
      return;
    }

    if (envAdmin && trimmedEmail === envAdmin.email.toLowerCase() && password === envAdmin.password) {
      onLogin({ name: 'Admin', email: envAdmin.email, password: envAdmin.password });
      navigate('/');
      return;
    }

    if (trimmedEmail === fallbackAdmin.email && password === fallbackAdmin.password) {
      const adminToLogin = {
        name: fallbackAdmin.name,
        email: fallbackAdmin.email,
        password: fallbackAdmin.password,
      };

      if (!savedAdmins.some((admin) => admin?.email?.toLowerCase() === fallbackAdmin.email)) {
        savedAdmins.push(adminToLogin);
        localStorage.setItem('admin-users', JSON.stringify(savedAdmins));
      }

      onLogin(adminToLogin);
      navigate('/');
      return;
    }

    setError('Invalid admin credentials. Please try again.');
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <h1>Fresh Eats Admin</h1>
          <p>Secure access to your food delivery management dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error ? <p className="admin-login-error">{error}</p> : null}

          <button type="submit">Sign in</button>
        </form>

        <p className="admin-auth-switch">
          Need an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
