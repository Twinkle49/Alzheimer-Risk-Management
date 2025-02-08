import React, { useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import ShowAssessmentData from "../Assesment/ShowAssessment";
import UserProfile from "../UserProfile";
import NavMon from "../NavMon";

const AssessmentForm = () => {
  const [assessmentData, setAssessmentData] = useState({
    assessmentID: "",
    patientID: "",
    riskScore: "",
    assessmentDate: "",
    recommendations: "",
    careType: "",
    startDate: "",
    endDate: "",
  });

  const [modalData, setModalData] = useState({
    isVisible: false,
    message: "",
    type: "", // success or error
  });

  const [showAssessmentForm, setShowAssessmentForm] = useState(true); // Show Assessment Form by default
  const [showAssessmentData, setShowAssessmentData] = useState(false); // Initially hide ShowAssessmentData

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssessmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      assessmentID: assessmentData.assessmentID,
      patientID: assessmentData.patientID,
      riskScore: assessmentData.riskScore,
      assessmentDate: assessmentData.assessmentDate,
      recommendations: assessmentData.recommendations,
      careType: assessmentData.careType,
      startDate: assessmentData.startDate,
      endDate: assessmentData.endDate,
    };

    try {
      const response = await fetch("http://localhost:8081/api/assessments", {
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
          message: "Assessment added successfully!",
          type: "success",
        });
        // Optionally, reset the form after success
        setAssessmentData({
          assessmentID: "",
          patientID: "",
          riskScore: "",
          assessmentDate: "",
          recommendations: "",
          careType: "",
          startDate: "",
          endDate: "",
        });
      } else {
        setModalData({
          isVisible: true,
          message: "Error adding assessment: " + result.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setModalData({
        isVisible: true,
        message: "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

  const closeModal = () => {
    setModalData({
      ...modalData,
      isVisible: false,
    });
  };

  // Toggle between Show Assessment Form and Show Assessment Data
  const toggleAssessmentForm = () => {
    setShowAssessmentForm(true);
    setShowAssessmentData(false);
  };

  const toggleShowAssessmentData = () => {
    setShowAssessmentData(true);
    setShowAssessmentForm(false);
  };

  return (
    <>
      <Header />
      <UserProfile />
      <NavMon />
      <div className="col-12">
        <div className="container">
          {/* Buttons to toggle between Show Assessment Form and Show Assessment Data */}
          <div className="button-container">
            <button className="toggle-btn" onClick={toggleAssessmentForm}>
              Show Assessment Form
            </button>
            <button className="toggle-btn" onClick={toggleShowAssessmentData}>
              Show Assessment Data
            </button>
          </div>

          {/* Conditionally render Assessment Form */}
          {showAssessmentForm && (
            <div className="form-container">
              <h2>Add New Assessment</h2>
              <form onSubmit={handleSubmit}>
                <label htmlFor="assessmentID">Assessment ID:</label>
                <input
                  type="text"
                  id="assessmentID"
                  name="assessmentID"
                  value={assessmentData.assessmentID}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="patientID">Patient ID:</label>
                <input
                  type="text"
                  id="patientID"
                  name="patientID"
                  value={assessmentData.patientID}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="riskScore">Risk Score:</label>
                <input
                  type="number"
                  id="riskScore"
                  name="riskScore"
                  value={assessmentData.riskScore}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="assessmentDate">Assessment Date:</label>
                <input
                  type="date"
                  id="assessmentDate"
                  name="assessmentDate"
                  value={assessmentData.assessmentDate}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="recommendations">Recommendations:</label>
                <textarea
                  id="recommendations"
                  name="recommendations"
                  value={assessmentData.recommendations}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="careType">Care Type:</label>
                <select
                  id="careType"
                  name="careType"
                  value={assessmentData.careType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Care Type</option>
                  <option value="Preventive">Preventive</option>
                  <option value="Therapeutic">Therapeutic</option>
                  <option value="Palliative">Palliative</option>
                </select>

                <label htmlFor="startDate">Start Date:</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={assessmentData.startDate}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="endDate">End Date:</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={assessmentData.endDate}
                  onChange={handleChange}
                  required
                />

                <button type="submit">Add Assessment</button>
              </form>
            </div>
          )}

          {/* Conditionally render ShowAssessmentData */}
          {showAssessmentData && <ShowAssessmentData />}
        </div>
      </div>

      {/* Dialog for success/error */}
      {modalData.isVisible && (
        <dialog open className={`dialog ${modalData.type}`}>
          <h2>{modalData.type === "success" ? "Success!" : "Error!"}</h2>
          <p>{modalData.message}</p>
          <button onClick={closeModal}>Close</button>
        </dialog>
      )}
    </>
  );
};

export default AssessmentForm;
