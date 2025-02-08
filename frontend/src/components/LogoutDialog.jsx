
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';


function LogoutDialog  ({ open, onCancel, onLogout })  {
  // Initialize isLoggedIn state to false
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem('token');
    onLogout();
    setLoggedIn(false);
    setIsLoggingOut(true);
     navigate("/");
    // window.location.assign("/");
  };
  
 
  return (
    <>
      <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth >
        <DialogTitle className="dialog-title">
          <div className="centered-typography">
            <Typography variant="h6">Confirm Logout</Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to logout?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            No
          </Button>
          <Button
            onClick={handleLogout}
            color="primary"
            variant="contained"
            startIcon={<ExitToAppIcon />}
          >
            Yes, Logout
          </Button>
        </DialogActions>
      </Dialog>

    
    </>
  );
};

export default LogoutDialog;
