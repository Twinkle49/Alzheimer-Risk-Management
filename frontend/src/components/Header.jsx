import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Header.css"

const Header = ({ username }) => {
  return (
    <header className="home-header">
      <h1>Patient Management System</h1>
      <p>Your solution for managing Alzheimer's risk and patient data</p>
      {username && <p>Welcome back, <strong>{username}</strong>!</p>}
    </header>
  );
};

export default Header;
