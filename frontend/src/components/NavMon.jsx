import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Navbar.css";
import { FaHome, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import LogoutDialog from "../components/LogoutDialog";

function Navbar() {
  const [isIconDisabled, setIsIconDisabled] = useState(false);
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  const navigateToPreviousTopic = () => {
    setIsIconDisabled(true);
    navigate(-1);
  };

  const navigateToNextTopic = () => {
    navigate(1);
  };

  useEffect(() => {
    setIsIconDisabled(false);
  }, []);

  const openLogoutDialog = () => {
    localStorage.removeItem('token');
    setLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogout = () => {
    closeLogoutDialog();
  };

  return (
    <nav className="container-fluid bg-primary m-0 p-0">
      <div className="button-container">
        <Link to="/home">
          <button className="feature-btn">
            <FaHome className="icon" /> Home
          </button>
        </Link>

        <button 
          className="feature-btn" 
          onClick={navigateToPreviousTopic} 
          disabled={isIconDisabled}>
          <FaArrowLeft className="icon" /> Previous
        </button>

        <button 
          className="feature-btn" 
          onClick={navigateToNextTopic} 
          disabled={isIconDisabled}>
          <FaArrowRight className="icon" /> Next
        </button>

        <button 
          className="feature-btn" 
          title="Logout" 
          onClick={openLogoutDialog}>
          <ImExit className="icon" /> Logout
        </button>
      </div>

      <LogoutDialog
        open={isLogoutDialogOpen}
        onCancel={closeLogoutDialog}
        onLogout={handleLogout}
      />
    </nav>
  );
}

export default Navbar;
