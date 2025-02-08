import React, { useState } from 'react';
import axios from 'axios';
import Header from '../Header';
import ShowTest from '../TestForm/ShowForm';
import '../../styles/PatientForm.css';
import UserProfile from "../UserProfile";
import NavMon from "../NavMon";

const TestForm = () => {
  const [showTestForm, setShowTestForm] = useState(true);
  const [showShowTest, setShowShowTest] = useState(false);

  const [formData, setFormData] = useState({
    testID: '',
    patientID: '',
    testType: '',
    betaAmyloidResult: '',
    plaquePresence: '',
    cognitiveScore: '',
    testDate: '',
    testComment: '',
  });

  const [modalData, setModalData] = useState({
    isVisible: false,
    type: '', // "success" or "error"
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/api/tests', formData);
      setModalData({
        isVisible: true,
        type: 'success',
        message: 'Test data submitted successfully!',
      });
      console.log(response.data);
    } catch (error) {
      setModalData({
        isVisible: true,
        type: 'error',
        message: 'Error submitting test data.',
      });
      console.error(error);
    }
  };

  const closeModal = () => {
    setModalData({ isVisible: false, type: '', message: '' });
  };

  const handleShowTestForm = () => {
    setShowTestForm(true);
    setShowShowTest(false);
  };

  const handleShowTestComponent = () => {
    setShowShowTest(true);
    setShowTestForm(false);
  };

  return (
    <>
      <Header />
      <UserProfile />
      <NavMon />
      <div className="test-form-page">
        <div className="patient-form-container">
          <div className="button-container">
            <button className="toggle-btn" onClick={handleShowTestForm}>
              Show Test Form
            </button>
            <button className="toggle-btn" onClick={handleShowTestComponent}>
              Show Test Data
            </button>
          </div>

          {showTestForm && (
            <div className="form-wrapper">
              <div className="form-container">
                <h1>Submit Test Details</h1>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Test ID</label>
                    <input
                      type="text"
                      name="testID"
                      value={formData.testID}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Patient ID</label>
                    <input
                      type="text"
                      name="patientID"
                      value={formData.patientID}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Test Type</label>
                    <select
                      name="testType"
                      value={formData.testType}
                      onChange={handleChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select Test Type</option>
                      <option value="Blood Test">Blood Test</option>
                      <option value="Cognitive Test">Cognitive Test</option>
                      <option value="Imaging Test">Imaging Test</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Beta Amyloid Result</label>
                    <select
                      name="betaAmyloidResult"
                      value={formData.betaAmyloidResult}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">Select Result</option>
                      <option value="Normal">Normal</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Plaque Presence</label>
                    <select
                      name="plaquePresence"
                      value={formData.plaquePresence}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">Select Presence</option>
                      <option value="Absent">Absent</option>
                      <option value="Present">Present</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Cognitive Score</label>
                    <input
                      type="number"
                      name="cognitiveScore"
                      value={formData.cognitiveScore}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Test Date</label>
                    <input
                      type="date"
                      name="testDate"
                      value={formData.testDate}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Test Comment</label>
                    <textarea
                      name="testComment"
                      value={formData.testComment}
                      onChange={handleChange}
                      className="form-control"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary mt-3">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}

          {showShowTest && <ShowTest />}
        </div>

        {/* Dialog for success/failure message */}
        {modalData.isVisible && (
          <dialog open className={`dialog ${modalData.type}`}>
            <h2>{modalData.type === 'success' ? 'Success!' : 'Error!'}</h2>
            <p>{modalData.message}</p>
            <button onClick={closeModal} className="btn btn-secondary">
              Close
            </button>
          </dialog>
        )}
      </div>
    </>
  );
};

export default TestForm;
