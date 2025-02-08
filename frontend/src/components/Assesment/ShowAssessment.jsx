import React, { useState, useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";
import * as XLSX from "xlsx";
import "../../styles/Assess.css";

// Function to format the date to 'DD-MM-YYYY' format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const ShowAssessment = () => {
  const [assessments, setAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [editingAssessment, setEditingAssessment] = useState(null); // State to hold the assessment being edited
  const [modalAction, setModalAction] = useState(null); // To determine whether the modal is for Edit or Delete
  const [filters, setFilters] = useState({
    careType: '',
    startDate: '',
    endDate: '',
    riskScore: ''
  });
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [assessmentsPerPage, setAssessmentsPerPage] = useState(5); // Number of assessments per page

  // Fetch assessment data from API
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/assessments");
        const result = await response.json();
        if (response.ok) {
          setAssessments(result);
          setFilteredAssessments(result); // Initialize with all assessments
        } else {
          console.error("Error fetching assessments:", result.message);
        }
      } catch (error) {
        console.error("Error fetching assessments:", error);
      }
    };

    fetchAssessments();
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    filterAssessments(query);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Filter assessments based on search term and filters
  const filterAssessments = (query = '') => {
    let filtered = assessments.filter((assessment) => {
      const matchesSearchTerm =
        assessment.AssessmentID.toString().includes(query) ||
        assessment.PatientID.toString().includes(query) ||
        assessment.CareType.toLowerCase().includes(query);

      const matchesCareType =
        filters.careType ? assessment.CareType.toLowerCase().includes(filters.careType.toLowerCase()) : true;

      const matchesRiskScore =
        filters.riskScore ? assessment.RiskScore.toString().includes(filters.riskScore) : true;

      const matchesDateRange =
        filters.startDate && filters.endDate
          ? new Date(assessment.AssessmentDate) >= new Date(filters.startDate) &&
            new Date(assessment.AssessmentDate) <= new Date(filters.endDate)
          : true;

      return (
        matchesSearchTerm &&
        matchesCareType &&
        matchesRiskScore &&
        matchesDateRange
      );
    });

    setFilteredAssessments(filtered);
  };

  // Export a single assessment to CSV
  const exportSingleCSV = (assessment) => {
    const csvData = [
      {
        AssessmentID: assessment.AssessmentID,
        PatientID: assessment.PatientID,
        RiskScore: assessment.RiskScore,
        AssessmentDate: formatDate(assessment.AssessmentDate),
        Recommendations: assessment.Recommendations,
        CareType: assessment.CareType,
        StartDate: formatDate(assessment.StartDate),
        EndDate: formatDate(assessment.EndDate),
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SingleAssessment");
    XLSX.writeFile(workbook, `Assessment-${assessment.AssessmentID}.csv`);
  };

  // Export a single assessment to Excel
  const exportSingleExcel = (assessment) => {
    const excelData = [
      {
        AssessmentID: assessment.AssessmentID,
        PatientID: assessment.PatientID,
        RiskScore: assessment.RiskScore,
        AssessmentDate: formatDate(assessment.AssessmentDate),
        Recommendations: assessment.Recommendations,
        CareType: assessment.CareType,
        StartDate: formatDate(assessment.StartDate),
        EndDate: formatDate(assessment.EndDate),
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SingleAssessment");
    XLSX.writeFile(workbook, `Assessment-${assessment.AssessmentID}.xlsx`);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredAssessments.length / assessmentsPerPage);
  const indexOfLastAssessment = currentPage * assessmentsPerPage;
  const indexOfFirstAssessment = indexOfLastAssessment - assessmentsPerPage;
  const currentAssessments = filteredAssessments.slice(indexOfFirstAssessment, indexOfLastAssessment);

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

  return (
    <>
      <div className="container">
        <h2>Assessment List</h2>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Assessment ID, Patient ID, or Care Type"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
            style={{ width: "50%" }}
          />
        </div>

        {/* Filters */}
        <div className="filters">
          <label>Care Type:</label>
          <input
            type="text"
            name="careType"
            value={filters.careType}
            onChange={handleFilterChange}
            placeholder="Care Type"
          />
          <label>Risk Score:</label>
          <input
            type="text"
            name="riskScore"
            value={filters.riskScore}
            onChange={handleFilterChange}
            placeholder="Risk Score"
          />
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>

        {filteredAssessments.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Assessment ID</th>
                  <th>Patient ID</th>
                  <th>Risk Score</th>
                  <th>Assessment Date</th>
                  <th>Recommendations</th>
                  <th>Care Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentAssessments.map((assessment) => (
                  <tr key={assessment.AssessmentID}>
                    <td>{assessment.AssessmentID}</td>
                    <td>{assessment.PatientID}</td>
                    <td>{assessment.RiskScore}</td>
                    <td>{formatDate(assessment.AssessmentDate)}</td>
                    <td>{assessment.Recommendations}</td>
                    <td>{assessment.CareType}</td>
                    <td>{formatDate(assessment.StartDate)}</td>
                    <td>{formatDate(assessment.EndDate)}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => exportSingleCSV(assessment)}
                      >
                        Export CSV
                      </button>
                      <button
                        className="btn btn-secondary ml-2"
                        onClick={() => exportSingleExcel(assessment)}
                      >
                        Export Excel
                      </button>
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
          <p>No assessments found.</p>
        )}
      </div>
    </>
  );
};

export default ShowAssessment;
