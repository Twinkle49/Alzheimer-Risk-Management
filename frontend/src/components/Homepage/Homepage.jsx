import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "../../styles/Homepage.css";
import UserProfile from '../UserProfile';
import NavMon from "../NavMon";

const HomePage = () => {
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);  // Corrected state for role

  useEffect(() => {
    // Retrieve username and role from localStorage
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (username && role) {
      setUsername(username); // Set username
      setRole(role); // Set role
    } else {
      console.error('Username or role is missing from localStorage');
    }
  }, []);

  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="home-header">
        <h1>Patient Management System</h1>
        <p>Your solution for managing Alzheimer's risk and patient data</p>
        {username ? (
          <p>Welcome back, <strong>{role}</strong>!</p>
        ) : (
          <p>Welcome, Guest!</p>
        )}
      </header>

      <UserProfile />
      <NavMon />

      {/* Main Content */}
      <main className="home-main">
        {username ? (
          <section className="dashboard">
            <div className="feature-cards">
              {/* Always Visible Features */}
              <div className="feature-card">
                <h3>Risk Calculation</h3>
                <p>Evaluate and manage patients' risk data.</p>
                <Link to="/patientData">
                  <button className="feature-btn">Risk Calculate</button>
                </Link>
              </div>

              {/* Show Patient Management only if the role is Admin */}
              {role === 'Admin' && (
                <div className="feature-card">
                  <h3>Patient Management</h3>
                  <p>Manage patient demographics, tests, and assessments.</p>
                  <Link to="/patients">
                    <button className="feature-btn">Go to Patients</button>
                  </Link>
                </div>
              )}

              {/* Show Assessments for all roles */}
              <div className="feature-card">
                <h3>Assessments</h3>
                <p>Track Alzheimer's risk scores and care plans.</p>
                <Link to="/assessments">
                  <button className="feature-btn">Go to Assessments</button>
                </Link>
              </div>

              {/* Show Test Reports for all roles */}
              <div className="feature-card">
                <h3>Test Reports</h3>
                <p>View and manage test reports.</p>
                <Link to="/testform">
                  <button className="feature-btn">Go to Test Reports</button>
                </Link>
              </div>

              {/* Show Lifestyle for all roles */}
              <div className="feature-card">
                <h3>Lifestyle</h3>
                <p>Manage and track lifestyle data and its impact on health.</p>
                <Link to="/lifestyleform">
                  <button className="feature-btn">Go to Lifestyle</button>
                </Link>
              </div>

              {/* Show Add User only for Admin */}
              {role === 'Admin' && (
                <div className="feature-card">
                  <h3>Add User</h3>
                  <p>Add new users to the system.</p>
                  <Link to="/adduser">
                    <button className="feature-btn">Add User</button>
                  </Link>
                </div>
              )}

              {/* Show Edit Patient for Doctor only */}
              {role === 'Doctor' && (
                <div className="feature-card">
                  <h3>Edit Patient</h3>
                  <p>Edit and Delete Patient.</p>
                  <Link to="/patientedit">
                    <button className="feature-btn">Edit Patients</button>
                  </Link>
                </div>
              )}

              {/* Show Edit User only for Admin */}
              {role === 'Admin' && (
                <div className="feature-card">
                  <h3>Edit User</h3>
                  <p>Edit and Delete User.</p>
                  <Link to="/userlist">
                    <button className="feature-btn">Edit Users</button>
                  </Link>
                </div>
              )}

{role === 'Admin' && (
                <div className="feature-card">
                  <h3>Risk Data</h3>
                  <p>View and manage Alzheimer's risk data.</p>
                  <Link to="/patientedit">
                    <button className="feature-btn">Go to Risk Data</button>
                  </Link>
                </div>
              )}
              {/* Show Risk Data only for Researcher */}
              {role === 'Researcher' && (
                <div className="feature-card">
                  <h3>Risk Data</h3>
                  <p>View and manage Alzheimer's risk data.</p>
                  <Link to="/patientData">
                    <button className="feature-btn">Go to Risk Data</button>
                  </Link>
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="guest-content">
            <h2>Welcome to Patient Management System</h2>
            <p>Please log in to access the dashboard and manage patient data effectively.</p>
          </section>
        )}
      </main>

      {/* Footer Section */}
      <footer className="home-footer">
        <p>&copy; 2024 Patient Management System | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default HomePage;
