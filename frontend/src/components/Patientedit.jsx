import React, { useState, useEffect } from "react";
import { Button, Table, Form } from "react-bootstrap";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Header from "../components/Header"; // Assuming you have a header component
import UserProfile from "./UserProfile";
import Navbar from "./NavMon";
const PatientFormData = () => {
  const [patientData, setPatientData] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientsPerPage, setPatientsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch patient data on component mount
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/patients-form");
        const result = await response.json();
        if (response.ok) {
          setPatientData(result);
          setFilteredPatients(result);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };
    fetchPatientData();
  }, []);

  // Handle search by patient name or ID
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    const filtered = patientData.filter((data) =>
      data.name.toLowerCase().includes(query) || data.PatientID.toString().includes(query)
    );
    setFilteredPatients(filtered);
    setCurrentPage(1);
  };

  // Pagination calculations
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const showDeleteModal = (patientId) => {
    setPatientToDelete(patientId);
    setDeleteModalOpen(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsEditing(true);
  };
  // Close modal without deleting
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setPatientToDelete(null);
  };

  // Handle delete confirmation
  const handleDeletePatient = async () => {
    if (!patientToDelete) return;

    try {
      const response = await fetch(`http://localhost:8081/api/patients-form/${patientToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update state to remove the deleted patient
        setPatientData(patientData.filter((patient) => patient.PatientID !== patientToDelete));
        setFilteredPatients(filteredPatients.filter((patient) => patient.PatientID !== patientToDelete));
        setIsDeleted(true);
        closeDeleteModal();
      } else {
        const errorMessage = await response.text();
        console.error(`Failed to delete patient: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Network error, unable to delete patient.");
    }
  };

  return (
    <div>
      <Header />
      <UserProfile/>
      <Navbar/>
      <div className="container">
        <h2>Patient Data</h2>
        <input
          type="text"
          placeholder="Search by Patient ID or Name"
          value={searchTerm}
          onChange={handleSearch}
        />

        {filteredPatients.length > 0 ? (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Patient Info</th>
                  <th>Assessment Info</th>
                  <th>Test Info</th>
                  <th>Lifestyle Info</th>
                  <th>Actions</th>
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
                    <td>
                      {/* <Button variant="warning" onClick={() => handleEditPatient(data)}>
                        Edit
                      </Button> */}
                      <Button variant="danger" onClick={() => showDeleteModal(data.PatientID)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <p>No patients found.</p>
        )}

        {/* Pagination with current page and total pages */}
        <div>
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <Button
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          >
            Previous
          </Button>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
          >
            Next
          </Button>
        </div>

        {/* Dialog for Delete Confirmation */}
        <Dialog open={deleteModalOpen} onClose={closeDeleteModal}>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this patient?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteModal} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleDeletePatient} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for patient delete confirmation */}
        <Snackbar open={isDeleted} autoHideDuration={2000} onClose={() => setIsDeleted(false)}>
          <MuiAlert elevation={6} variant="filled" severity="success" onClose={() => setIsDeleted(false)}>
            Patient deleted successfully!
          </MuiAlert>
        </Snackbar>
      </div>
    </div>
  );
};

export default PatientFormData;
