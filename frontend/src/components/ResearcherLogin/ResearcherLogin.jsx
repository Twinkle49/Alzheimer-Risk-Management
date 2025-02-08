import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls

const ResearcherLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (username === '' || password === '') {
      setError('Please fill in both fields.');
      return;
    }

    try {
      // API call to authenticate researcher (example endpoint: '/api/login/researcher')
      const response = await axios.post('/api/login/researcher', {
        username,
        password,
      });

      if (response.data.success) {
        setError('');
        // Redirect to Researcher Dashboard after successful login
        navigate('/researcher/dashboard');
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      setError('An error occurred while logging in. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <h1>Researcher Login</h1>
        <p>Sign in to view aggregated data and run predefined queries</p>
      </header>

      <main className="login-main">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">Login</button>
        </form>
      </main>

      <footer className="login-footer">
        <p>&copy; 2024 Patient Management System | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default ResearcherLogin;
