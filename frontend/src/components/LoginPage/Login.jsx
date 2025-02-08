import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/loginpage.css';
import axios from "axios";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    try {
      const response = await axios.post('http://localhost:8081/login', {
        username,
        password,
      });
  
      if (response.data.success) {
        const { user, token } = response.data;
      
        // Store token, user role, and username in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role); // Save the role
        localStorage.setItem('username', user.username); // Save the username
        
        navigate('/home');
        setMessage(`Welcome, ${user.username}!`);
      
        onLoginSuccess();
        console.log("The User Logging in is: ", `${user.username}`);
      }
      else {
        setMessage('Invalid credentials');
      }
    } catch (error) {
      console.error('API request failed:', error);
      setMessage('Invalid Username or Password');
    }
  };
  
  return (
    <div className="login-container">
      <h1>Welcome Back</h1>
      <p className="subtitle">Please sign in to continue</p>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
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
          />
        </div>
        <button type="submit" className="login-button">Log In</button>
        {error && <div className="error">{error}</div>}
        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
};

export default Login;
