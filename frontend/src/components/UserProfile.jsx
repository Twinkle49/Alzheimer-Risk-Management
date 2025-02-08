import React, { useState, useEffect } from 'react';
import "../styles/UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState({ username: '', role: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the data from localStorage
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    // Check if the username and role are available
    if (username && role) {
      setUser({ username, role });
    } else {
      console.error('Username or role is missing from localStorage');
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile-container">
      <div className="username">UserName: {user.username}</div>
      <div className="role">Role: {user.role}</div>
    </div>
  );
};

export default UserProfile;
