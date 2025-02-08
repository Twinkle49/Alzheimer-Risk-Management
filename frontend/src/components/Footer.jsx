import React from 'react';

const Footer = () => {
  const footerStyle = {
    position: 'sticky',
    bottom: '0',
    width: '100%',
    backgroundColor: '#007bff', // Background color
    color: 'white', // Text color
    textAlign: 'center',
    padding: '15px 0', // Padding for the footer content
    fontSize: '1rem',
    boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)', // Optional shadow
  };

  return (
    <footer style={footerStyle}>
      <p>&copy; 2024 Patient Management System | All Rights Reserved</p>
    </footer>
  );
};

export default Footer;
