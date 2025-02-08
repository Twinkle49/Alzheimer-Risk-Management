import React, { createContext, useState, useEffect } from 'react';


// Create a context for authentication
export const AuthContext = createContext();

const TOKEN_KEY = 'token'; 

// Function to get token from storage
const getToken = () => localStorage.getItem(TOKEN_KEY);

// Function to set token to storage
const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

// Function to remove token from storage
const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  // Function to check if the token exists and set authentication state
  const checkAuthentication = () => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
     
    }
  };

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthentication();

    // Set a timeout to remove the token after 8 hours (8 * 60 * 60 * 1000 milliseconds)
    const timeoutId = setTimeout(() => {
      logout(); // Call logout after 8 hours of inactivity
    }, 8 * 60 * 60 * 1000);

    // Clear the timeout if the component unmounts or user logs in
    return () => {
      clearTimeout(timeoutId);
    };
  }, []); // Run only on mount

  // Login function to authenticate user and store token
  const login = (token) => {
    setToken(token); // Store token in localStorage
    setIsAuthenticated(true);
    checkAuthentication(); // Check authentication state after login
  };

  // Logout function to clear token and update state
  const logout = () => {
    removeToken(); // Remove token from localStorage
    setIsAuthenticated(false);
    window.location.href = '/';
    
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
