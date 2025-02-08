import React, { useState } from "react";
import { Form, Button } from "react-bootstrap"; // Remove Modal import from react-bootstrap
import Header from "../Header";
import Footer from "../Footer";
import "../../styles/PatientForm.css";
import ShowLifestyleData from "../LifestyleDataform/Showlifestyle";
import UserProfile from "../UserProfile";
import NavMon from "../NavMon";

const LifestyleDataForm = () => {
  const [formData, setFormData] = useState({
    DataID: "",
    PatientID: "",
    Diet: "",
    SocialEngagement: "",
    ExerciseFrequency: "",
    SmokingStatus: "",
    SleepQuality: "",
    HistoryOfHypertension: "",
    HistoryOfHeartDisease: "",
    DiabetesStatus: "",
    DataCollectedDate: "",
  });

  const [dialogMessage, setDialogMessage] = useState(""); // Store the message to be displayed in the dialog
  const [showLifestyleDataForm, setShowLifestyleDataForm] = useState(true); // Show Lifestyle Data Form initially
  const [showLifestyleData, setShowLifestyleData] = useState(false); // Initially hide ShowLifestyleData
  const [showDialog, setShowDialog] = useState(false); // State to control dialog visibility

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/api/lifestyle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Show success dialog if the data is successfully submitted
        setDialogMessage("Data successfully submitted!");
        setShowDialog(true); // Show dialog
        setFormData({
          DataID: "",
          PatientID: "",
          Diet: "",
          SocialEngagement: "",
          ExerciseFrequency: "",
          SmokingStatus: "",
          SleepQuality: "",
          HistoryOfHypertension: "",
          HistoryOfHeartDisease: "",
          DiabetesStatus: "",
          DataCollectedDate: "",
        });
      } else {
        console.error("Error submitting form data");
        setDialogMessage("There was an issue submitting the form.");
        setShowDialog(true); // Show dialog on error
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setDialogMessage("There was an error submitting the form.");
      setShowDialog(true); // Show dialog on error
    }
  };

  // Close dialog
  const handleCloseDialog = () => setShowDialog(false);

  // Toggle the visibility of the Lifestyle Data Form
  const toggleLifestyleDataForm = () => {
    setShowLifestyleDataForm(true);
    setShowLifestyleData(false);
  };

  // Toggle the visibility of the Show Lifestyle Data
  const toggleShowLifestyleData = () => {
    setShowLifestyleData(true);
    setShowLifestyleDataForm(false);
  };

  return (
    <>
      <Header />
      <UserProfile />
      <NavMon />
      <div className="col-12">
        <div className="container">
          {/* Buttons to toggle between Lifestyle Data Form and Show Lifestyle Data */}
          <div className="button-container">
            <button className="toggle-btn" onClick={toggleLifestyleDataForm}>
              Show Lifestyle Data Form
            </button>
            <button className="toggle-btn" onClick={toggleShowLifestyleData}>
              Show Lifestyle Data
            </button>
          </div>

          {/* Conditionally render Lifestyle Data Form */}
          {showLifestyleDataForm && (
            <div className="form-container">
              <h2>Lifestyle Data Entry</h2>
              <Form onSubmit={handleFormSubmit}>
                <Form.Group>
                  <Form.Label>Data ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="DataID"
                    value={formData.DataID}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Patient ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="PatientID"
                    value={formData.PatientID}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Diet</Form.Label>
                  <Form.Select
                    name="Diet"
                    value={formData.Diet}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Diet</option>
                    <option value="Balanced">Balanced</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Poor">Poor</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Social Engagement</Form.Label>
                  <Form.Select
                    name="SocialEngagement"
                    value={formData.SocialEngagement}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Engagement</option>
                    <option value="Active">Active</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Isolated">Isolated</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Exercise Frequency</Form.Label>
                  <Form.Select
                    name="ExerciseFrequency"
                    value={formData.ExerciseFrequency}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Frequency</option>
                    <option value="Regular">Regular</option>
                    <option value="Occasional">Occasional</option>
                    <option value="None">None</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Smoking Status</Form.Label>
                  <Form.Select
                    name="SmokingStatus"
                    value={formData.SmokingStatus}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Smoking Status</option>
                    <option value="Non-smoker">Non-smoker</option>
                    <option value="Former smoker">Former smoker</option>
                    <option value="Current smoker">Current smoker</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Sleep Quality</Form.Label>
                  <Form.Select
                    name="SleepQuality"
                    value={formData.SleepQuality}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Sleep Quality</option>
                    <option value="Good">Good</option>
                    <option value="Disturbed">Disturbed</option>
                    <option value="Chronic issues">Chronic issues</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>History of Hypertension</Form.Label>
                  <Form.Select
                    name="HistoryOfHypertension"
                    value={formData.HistoryOfHypertension}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>History of Heart Disease</Form.Label>
                  <Form.Select
                    name="HistoryOfHeartDisease"
                    value={formData.HistoryOfHeartDisease}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Diabetes Status</Form.Label>
                  <Form.Select
                    name="DiabetesStatus"
                    value={formData.DiabetesStatus}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Data Collected Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="DataCollectedDate"
                    value={formData.DataCollectedDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Submit Lifestyle Data
                </Button>
              </Form>
            </div>
          )}

          {/* Conditionally render ShowLifestyleData */}
          {showLifestyleData && <ShowLifestyleData />}
        </div>
      </div>

      {/* Dialog for success/failure message */}
      {showDialog && (
        <dialog open className="dialog">
          <h2>Submission Status</h2>
          <p>{dialogMessage}</p>
          <button onClick={handleCloseDialog} className="btn btn-secondary">
            Close
          </button>
        </dialog>
      )}
    </>
  );
};

export default LifestyleDataForm;
