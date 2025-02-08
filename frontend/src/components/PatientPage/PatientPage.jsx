import React, { useState } from "react";
import "../../styles/PatientForm.css"; // Importing the CSS styling for this component
import Header from "../Header"; // Importing Header component
import ShowTest from "../PatientPage/ShowPatient"; // Importing ShowTest component for displaying tests
import Footer from "../Footer"; // Importing Footer component
import UserProfile from "../UserProfile"; // Importing UserProfile component
import NavMon from "../NavMon"; // Importing NavMon (navigation) component
import "../../styles/EditUser.css"

const PatientPage = () => {
  const [patientData, setPatientData] = useState({
    patientID: "",
    name: "",
    age: "",
    gender: "",
    phoneNumber: "",
    emailAddress: "",
    address: "",
    familyHistory: "",
    geneAPOE4: "",
  });

  const [modalData, setModalData] = useState({
    isVisible: false,
    message: "",
    type: "", // "success" or "error"
  });

  const [showPatientForm, setShowPatientForm] = useState(true);
  const [showTestForm, setShowTestForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "age" && value < 0) {
      setModalData({
        isVisible: true,
        message: "Age cannot be negative!",
        type: "error",
      });
      return; // Exit early if age is invalid
    }

    setPatientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      patientID: patientData.patientID,
      name: patientData.name,
      age: patientData.age,
      gender: patientData.gender,
      phoneNumber: patientData.phoneNumber,
      emailAddress: patientData.emailAddress,
      address: patientData.address,
      familyHistory: patientData.familyHistory,
      geneAPOE4: patientData.geneAPOE4,
    };

    try {
      const response = await fetch("http://localhost:8081/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setModalData({
          isVisible: true,
          message: "Patient added successfully!",
          type: "success",
        });
        setPatientData({
          patientID: "",
          name: "",
          age: "",
          gender: "",
          phoneNumber: "",
          emailAddress: "",
          address: "",
          familyHistory: "",
          geneAPOE4: "",
        });
      } else {
        setModalData({
          isVisible: true,
          message: "Error adding patient: " + result.message,
          type: "error",
        });
      }
    } catch (error) {
      setModalData({
        isVisible: true,
        message: "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

  const closeModal = () => {
    setModalData({ ...modalData, isVisible: false });
  };

  const handleShowPatientForm = () => {
    setShowPatientForm(true);
    setShowTestForm(false);
  };

  const handleShowTestForm = () => {
    setShowTestForm(true);
    setShowPatientForm(false);
  };

  return (
    <>
      <Header />
      <UserProfile />
      <NavMon />
      <div className="col-12">
        <div className="container1">
          <div className="button-container">
            <button className="toggle-btn" onClick={handleShowPatientForm}>
              Show Patient Form
            </button>
            <button className="toggle-btn" onClick={handleShowTestForm}>
              Show Patient Data
            </button>
          </div>

          {showPatientForm && (
            <div className="form-container">
              <h2>Add New Patient</h2>
              <form onSubmit={handleSubmit}>
                <label htmlFor="patientID">Patient ID:</label>
                <input
                  type="text"
                  id="patientID"
                  name="patientID"
                  value={patientData.patientID}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={patientData.name}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="age">Age:</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={patientData.age}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="gender">Gender:</label>
                <select
                  id="gender"
                  name="gender"
                  value={patientData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={patientData.phoneNumber}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="emailAddress">Email Address:</label>
                <input
                  type="email"
                  id="emailAddress"
                  name="emailAddress"
                  value={patientData.emailAddress}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="address">Address:</label>
                <textarea
                  id="address"
                  name="address"
                  value={patientData.address}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="familyHistory">Family History:</label>
                <select
                  id="familyHistory"
                  name="familyHistory"
                  value={patientData.familyHistory}
                  onChange={handleChange}
                >
                  <option value="">Select Family History</option>
                  <option value="No family history">No family history</option>
                  <option value="One immediate family member">
                    One immediate family member
                  </option>
                  <option value="Two or more immediate family members">
                    Two or more immediate family members
                  </option>
                </select>

                <label htmlFor="geneAPOE4">Gene APOE4 Status:</label>
                <select
                  id="geneAPOE4"
                  name="geneAPOE4"
                  value={patientData.geneAPOE4}
                  onChange={handleChange}
                >
                  <option value="">Select Gene Status</option>
                  <option value="No known gene variants">
                    No known gene variants
                  </option>
                  <option value="APOE-e4 Present">APOE-e4 Present</option>
                </select>

                <button type="submit">Add Patient</button>
              </form>
            </div>
          )}

          {showTestForm && <ShowTest />}

          {modalData.isVisible && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>{modalData.type === "success" ? "Success!" : "Error!"}</h2>
                <p>{modalData.message}</p>
                <button onClick={closeModal}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default PatientPage;
