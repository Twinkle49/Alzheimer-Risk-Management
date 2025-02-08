import React, { useState, useEffect } from "react";
import "../styles/Assess.css";
import * as XLSX from "xlsx"; // Import xlsx for exporting to Excel
import Header from "../components/Header";
import RiskCalculator from "./RiskCalculate/RiskCalculate";
import UserProfile from "../components/UserProfile";
import NavMon from "../components/NavMon";

const PatientFormData = () => {
  const [patientData, setPatientData] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientsPerPage, setPatientsPerPage] = useState(5); // Slider for patients per page
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null); // For holding selected patient for RiskCalculator

  // Fetch patient data from API
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/patients-form");
        const result = await response.json();

        if (response.ok) {
          setPatientData(result);
          setFilteredPatients(result); // Initialize with all patients
        } else {
          console.error("Error fetching data:", result.message);
          setError(result.message || "Unknown error occurred");
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError("Network error, please try again later.");
      }
    };

    fetchPatientData();
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    filterPatients(query);
  };

  // Filter patients based on search term
  const filterPatients = (query) => {
    const filtered = patientData.filter((data) =>
      data.name.toLowerCase().includes(query) ||
      data.PatientID.toString().includes(query)
    );
    setFilteredPatients(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  // Format date to 'YYYY-MM-DD' or any desired format
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB"); // Example: "DD/MM/YYYY"
  };

  // Export data to Excel (including RiskScore page)
  const exportToExcel = () => {
    const dataWithRisk = filteredPatients.map(patient => ({
      ...patient,
      riskScore: patient.PatientID === selectedPatient?.PatientID ? selectedPatient.riskScore : "N/A", // Include the risk score
    }));

    const ws = XLSX.utils.json_to_sheet(dataWithRisk); // Convert JSON to sheet
    const wb = XLSX.utils.book_new(); // Create new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Patient Data"); // Append sheet to workbook

    // Write to Excel file
    XLSX.writeFile(wb, "patient_data_with_risk.xlsx");
  };

  // Export data to CSV (including RiskScore page)
  const exportToCSV = () => {
    const dataWithRisk = filteredPatients.map(patient => ({
      ...patient,
      riskScore: patient.PatientID === selectedPatient?.PatientID ? selectedPatient.riskScore : "N/A", // Include the risk score
    }));

    const ws = XLSX.utils.json_to_sheet(dataWithRisk); // Convert JSON to sheet
    const csv = XLSX.utils.sheet_to_csv(ws); // Convert sheet to CSV format

    // Download CSV file
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "patient_data_with_risk.csv";
    link.click();
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  // Handle page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Toggle RiskCalculator for the selected patient
  const handleRiskCalculatorToggle = (patient) => {
    setSelectedPatient(selectedPatient?.PatientID === patient.PatientID ? null : patient);
  };

  return (
    <>
      <Header />
      <UserProfile/>
      <NavMon/>
      <div className="col-12">
        <div className="container">
          <h2>Patient Data</h2>

          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by Patient ID or Name"
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          {/* Error Message */}
          {error && <p>{error}</p>}

          {/* Table for Patient Data */}
          {filteredPatients.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Patient Info</th>
                    <th>Assessment Info</th>
                    <th>Test Info</th>
                    <th>Lifestyle Info</th>
                    <th>Report</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPatients.map((data, index) => (
                    <tr key={index}>
                      {/* Patient Data */}
                      <td>
                        <div>
                          <p><strong>Patient ID:</strong> {data.PatientID}</p>
                          <p><strong>Name:</strong> {data.name}</p>
                          <p><strong>Age:</strong> {data.age}</p>
                          <p><strong>Gender:</strong> {data.gender}</p>
                          <p><strong>Phone:</strong> {data.phoneNumber}</p>
                          <p><strong>Email:</strong> {data.emailAddress}</p>
                          <p><strong>Address:</strong> {data.address}</p>
                          <p><strong>Family History:</strong> {data.familyHistory}</p>
                          <p><strong>Gene APOE4:</strong> {data.geneAPOE4}</p>
                        </div>
                      </td>

                      {/* Assessment Data */}
                      <td>
                        {data.assessmentID ? (
                          <div>
                            <p><strong>Assessment ID:</strong> {data.assessmentID}</p>
                            <p><strong>Assessment Date:</strong> {formatDate(data.assessmentDate)}</p>
                            <p><strong>Recommendations:</strong> {data.recommendations}</p>
                            <p><strong>Care Type:</strong> {data.careType}</p>
                            <p><strong>Start Date:</strong> {formatDate(data.startDate)}</p>
                            <p><strong>End Date:</strong> {formatDate(data.endDate)}</p>
                          </div>
                        ) : (
                          <p>No assessment data available</p>
                        )}
                      </td>

                      {/* Test Data */}
                      <td>
                        {data.testID ? (
                          <div>
                            <p><strong>Test ID:</strong> {data.testID}</p>
                            <p><strong>Test Type:</strong> {data.testType}</p>
                            <p><strong>Beta Amyloid Result:</strong> {data.betaAmyloidResult}</p>
                            <p><strong>Plaque Presence:</strong> {data.plaquePresence}</p>
                            <p><strong>Cognitive Score:</strong> {data.cognitiveScore}</p>
                            <p><strong>Test Date:</strong> {formatDate(data.testDate)}</p>
                            <p><strong>Test Comment:</strong> {data.testComment}</p>
                          </div>
                        ) : (
                          <p>No test data available</p>
                        )}
                      </td>

                      {/* Lifestyle Data */}
                      <td>
                        {data.DataID ? (
                          <div>
                            <p><strong>Diet:</strong> {data.Diet}</p>
                            <p><strong>Social Engagement:</strong> {data.SocialEngagement}</p>
                            <p><strong>Exercise Frequency:</strong> {data.ExerciseFrequency}</p>
                            <p><strong>Smoking Status:</strong> {data.SmokingStatus}</p>
                            <p><strong>Sleep Quality:</strong> {data.SleepQuality}</p>
                            <p><strong>History of Hypertension:</strong> {data.HistoryOfHypertension}</p>
                            <p><strong>History of Heart Disease:</strong> {data.HistoryOfHeartDisease}</p>
                            <p><strong>Diabetes Status:</strong> {data.DiabetesStatus}</p>
                            <p><strong>Data Collected Date:</strong> {formatDate(data.DataCollectedDate)}</p>
                          </div>
                        ) : (
                          <p>No lifestyle data available</p>
                        )}
                      </td>

                      {/* Report Section with Export Buttons */}
                      <td>
                        <div className="export-buttons">
                          <button className="btn btn-primary" onClick={exportToExcel}>
                            Export to Excel
                          </button>
                          <button className="btn btn-secondary" onClick={exportToCSV}>
                            Export to CSV
                          </button>
                          <button 
                            className="btn btn-info" 
                            onClick={() => handleRiskCalculatorToggle(data)}>
                            {selectedPatient?.PatientID === data.PatientID ? 'Hide Risk Calculator' : 'Show Risk Calculator'}
                          </button>
                        </div>

                        {/* Conditionally Render RiskCalculator */}
                        {selectedPatient?.PatientID === data.PatientID && (
                          <RiskCalculator patientData={data} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  style={{ marginRight: '10px' }}
                >
                  Previous
                </button>
                <span style={{ marginRight: '10px', marginLeft: '10px' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-secondary"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  style={{ marginLeft: '10px' }}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <p>No patient data found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PatientFormData;
