import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage/Login.jsx";
import HomePage from "./components/Homepage/Homepage.jsx";
import PatientsPage from "./components/PatientPage/PatientPage.jsx";
import ProtectedRoute from './components/ProtectedRoute';
import AssessmentForm from "./components/Assesment/AssessmentForm.jsx";
import TestForm from "./components/TestForm/TestForm.jsx";
import LifestyleDataForm from "./components/LifestyleDataform/LifestyleDataForm.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import AdminLogin from "./components/AdminLogin/AdminLogin.jsx";
import HealthcareLogin from "./components/HealthcareLogin/HealthcareLogin.jsx";
import ResearcherLogin from "./components/ResearcherLogin/ResearcherLogin.jsx";
import ShowPatient from "./components/PatientPage/ShowPatient.jsx";
import PatientForm from "./components/PatientPage/PatientForm.jsx";
import ShowAssessment from "./components/Assesment/ShowAssessment.jsx";
import ShowForm from "./components/TestForm/ShowForm.jsx";
import ShowLifestyleData from "./components/LifestyleDataform/Showlifestyle.jsx";
import RiskCalculator from "./components/RiskCalculate/RiskCalculate.jsx";
import AddUserForm from "./components/AddUser/AddUser.jsx";
import PatientDataTable from "./components/PatientDataTable.jsx";
import PatientEdit from "./components/Patientedit.jsx";
import UserList from "./components/AddUser/EditUser.jsx";
// import 'bootstrap/dist/css/bootstrap.min.css';

const checkAuthStatus = () => {
  const token = localStorage.getItem('token');
  return !!token; // Assuming a valid token means the user is authenticated
};

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(checkAuthStatus());

  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  useEffect(() => {
    // Check authentication status on component mount
    setLoggedIn(checkAuthStatus());
  }, []);

  return (
    <Router>
      <Routes>
       <Route path="/" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/healthcare" element={<HealthcareLogin />} />
        <Route path="/login/researcher" element={<ResearcherLogin />} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<HomePage />} />} />
        <Route path="/show-patient" element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<ShowPatient />} />} />
        <Route path="/patientform" element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<PatientForm />} />} />
        <Route path="/showasse" element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<ShowAssessment />} />} />
        <Route path="/patientData" element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<PatientDataTable />} />} />
        <Route path="/patientedit" element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<PatientEdit />} />} />
        <Route path="/userlist" element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<UserList />} />} />
        <Route path="/patients" element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<PatientsPage />} />} />
        <Route path="/assessments" element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<AssessmentForm />} />} />
        <Route path="/testform" element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<TestForm />} />} />
        <Route path="/showform" element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<ShowForm />} />} />
        <Route path="/lifestyleform" element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<LifestyleDataForm />} />} />
        <Route path="/lifestyle" element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<ShowLifestyleData />} />} />
        <Route path="/risk" element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<RiskCalculator />} />} />
        <Route path="/AddUser" element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<AddUserForm />} />} />
        <Route path="/Dashboard" element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<Dashboard />} />} />
      </Routes>
    </Router>
  );
};

export default App;
