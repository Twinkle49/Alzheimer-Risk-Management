import React, { useState, useEffect } from "react";
import "../../styles/Assess.css";
import * as XLSX from "xlsx"; // Import xlsx

const ShowPatient = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientsPerPage, setPatientsPerPage] = useState(5); // Default to 5
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page

  // Fetch patient data from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/patients");
        const result = await response.json();
        if (response.ok) {
          setPatients(result);
          setFilteredPatients(result); // Initialize with all patients
        } else {
          console.error("Error fetching patients:", result.message);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    filterPatients(query);
  };

  // Filter patients based on search term across all parameters
  const filterPatients = (query) => {
    const filtered = patients.filter((patient) => {
      return (
        patient.Name.toLowerCase().includes(query) ||
        patient.PatientID.toString().includes(query) ||
        patient.Age.toString().includes(query) ||
        patient.Gender.toLowerCase().includes(query) ||
        patient.EmailAddress.toLowerCase().includes(query) ||
        patient.PhoneNumber.toLowerCase().includes(query) ||
        patient.Address.toLowerCase().includes(query) ||
        patient.FamilyHistory.toLowerCase().includes(query) ||
        patient.GeneAPOE4.toLowerCase().includes(query)
      );
    });
    setFilteredPatients(filtered);
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredPatients); // Convert JSON to sheet
    const wb = XLSX.utils.book_new(); // Create new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Patients"); // Append sheet to workbook

    // Write to Excel file
    XLSX.writeFile(wb, "patients.xlsx");
  };

  // Export to CSV
  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredPatients); // Convert JSON to sheet
    const csv = XLSX.utils.sheet_to_csv(ws); // Convert sheet to CSV format

    // Download CSV file
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "patients.csv";
    link.click();
  };

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

  // Handle change in patients per page
  const handlePatientsPerPageChange = (event) => {
    setPatientsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when changing the patients per page
  };

  return (
    <>
      <div className="col-12">
        <div className="container">
          <h2>Patient List</h2>

          {/* Search Bar */}
          <div className="search-container">
  <input
    type="text"
    placeholder="Search by Patient ID, Name, Age, Gender, etc."
    value={searchTerm}
    onChange={handleSearch}
    style={{ width: "50%" }}  // Inline style for width
    className="search-input"
  />
</div>


          {filteredPatients.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Address</th>
                    <th>Family History</th>
                    <th>GeneAPOE4</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPatients.map((patient) => (
                    <tr key={patient.PatientID}>
                      <td>{patient.PatientID}</td>
                      <td>{patient.Name}</td>
                      <td>{patient.Age}</td>
                      <td>{patient.Gender}</td>
                      <td>{patient.EmailAddress}</td>
                      <td>{patient.PhoneNumber}</td>
                      <td>{patient.Address}</td>
                      <td>{patient.FamilyHistory}</td>
                      <td>{patient.GeneAPOE4}</td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={exportToExcel}
                        >
                          Export to Excel
                        </button>
                        <button
                          className="btn btn-warning"
                          onClick={exportToCSV}
                        >
                          Export to CSV
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

             
              {/* Slider for patients per page */}
              <div className="patients-per-page" style={{ marginTop: '20px', textAlign: 'center' }}>
                <label>Patients per page: </label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={patientsPerPage}
                  onChange={handlePatientsPerPageChange}
                  style={{ marginLeft: '10px' }}
                />
                <span>{patientsPerPage}</span>
              </div>
            </div>
          ) : (
            <p>No patients found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ShowPatient;
