import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const savedAdmins = JSON.parse(localStorage.getItem('admin-users') || '[]');
    const alreadyExists = savedAdmins.some((admin) => admin.email.toLowerCase() === email.toLowerCase());

    if (alreadyExists) {
      setError('An admin account with this email already exists.');
      return;
    }

    const newAdmin = { name: name.trim(), email: email.trim().toLowerCase(), password };
    savedAdmins.push(newAdmin);
    localStorage.setItem('admin-users', JSON.stringify(savedAdmins));
    onSignup(newAdmin);
    navigate('/');
  };

  return (
    <div className="admin-signup-page">
      <div className="admin-signup-card">
        <div className="admin-signup-brand">
          <h1>Create admin account</h1>
          <p>Register a new admin account and manage your store instantly.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-signup-form">
          <label>
            Full name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Carter"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fresh-eats.com"
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

          <label>
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error ? <p className="admin-signup-error">{error}</p> : null}

          <button type="submit">Create account</button>
        </form>

        <p className="admin-auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
