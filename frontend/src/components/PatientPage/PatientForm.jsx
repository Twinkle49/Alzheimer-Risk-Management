import React, { useState } from 'react';
import ShowPatient from './ShowPatient';
import PatientPage from './PatientPage';
import '../../styles/PatientForm.css'; 

const PatientForm = () => {
  // State to manage which component is shown
  const [showShowPatient, setShowShowPatient] = useState(false);
  const [showPatientPage, setShowPatientPage] = useState(false);

  // Handler functions for buttons
  const handleShowPatient = () => {
    setShowShowPatient(true);
    setShowPatientPage(false);  
  };

  const handlePatientPage = () => {
    setShowPatientPage(true);
    setShowShowPatient(false);  
  };

  return (
    <div className='col-sm-12'>
    <div className="patient-form-container">
      <div className="button-container">
        {/* Buttons to toggle visibility */}
        <button className="toggle-btn" onClick={handleShowPatient}>
          Show Patient
        </button>
        <button className="toggle-btn" onClick={handlePatientPage}>
          Patient Page
        </button>
      </div>
      
      {/* Conditional rendering based on state */}
      <div className="page-content">
        {showShowPatient && <ShowPatient />}
        {showPatientPage && <PatientPage />}

      </div>
    </div>
    </div>
  );
};

export default PatientForm;
