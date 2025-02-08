import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "react-bootstrap"; // Import bootstrap components
import * as XLSX from 'xlsx'; // Import xlsx library

const TestManagement = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [testType, setTestType] = useState('');
  const [cognitiveScore, setCognitiveScore] = useState('');
  const [plaquePresence, setPlaquePresence] = useState('');
  const [testDateRange, setTestDateRange] = useState({ start: '', end: '' });
  const [patientsPerPage, setPatientsPerPage] = useState(5); // Default to 5 tests per page
  const [currentPage, setCurrentPage] = useState(1); // Track current page

  // Fetch test data from API
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/tests");
        const result = await response.json();
        if (response.ok) {
          setTests(result);
          setFilteredTests(result); // Initialize with all tests
        } else {
          console.error("Error fetching tests:", result.message);
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, []);

  // Filter tests based on search and filter parameters
  const filterTests = () => {
    let filtered = tests.filter((test) => {
      const matchesSearchTerm =
        test.TestType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.PatientID.toString().includes(searchTerm);

      const matchesTestType =
        testType ? test.TestType.toLowerCase().includes(testType.toLowerCase()) : true;

      const matchesCognitiveScore =
        cognitiveScore ? test.CognitiveScore.toString().includes(cognitiveScore) : true;

      const matchesPlaquePresence =
        plaquePresence ? test.PlaquePresence.toLowerCase().includes(plaquePresence.toLowerCase()) : true;

      const matchesDateRange =
        testDateRange.start && testDateRange.end
          ? new Date(test.TestDate) >= new Date(testDateRange.start) &&
            new Date(test.TestDate) <= new Date(testDateRange.end)
          : true;

      return (
        matchesSearchTerm &&
        matchesTestType &&
        matchesCognitiveScore &&
        matchesPlaquePresence &&
        matchesDateRange
      );
    });

    setFilteredTests(filtered);
  };

  // Filter on every change
  useEffect(() => {
    filterTests();
  }, [searchTerm, testType, cognitiveScore, plaquePresence, testDateRange]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTests.length / patientsPerPage);
  const indexOfLastTest = currentPage * patientsPerPage;
  const indexOfFirstTest = indexOfLastTest - patientsPerPage;
  const currentTests = filteredTests.slice(indexOfFirstTest, indexOfLastTest);

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

  // Handle search input change
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "testType") setTestType(value);
    if (name === "cognitiveScore") setCognitiveScore(value);
    if (name === "plaquePresence") setPlaquePresence(value);
    if (name === "startDate" || name === "endDate") {
      setTestDateRange((prevRange) => ({
        ...prevRange,
        [name]: value,
      }));
    }
  };

  // Export to Excel
  const exportSingleExcel = (test) => {
    const ws = XLSX.utils.json_to_sheet([test]); // Convert test data to sheet format
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Test'); // Add the sheet to the workbook
    XLSX.writeFile(wb, `test_${test.TestID}.xlsx`); // Generate the Excel file
  };

  // Export to CSV
  const exportSingleCSV = (test) => {
    const ws = XLSX.utils.json_to_sheet([test]); // Convert test data to sheet format
    const csv = XLSX.utils.sheet_to_csv(ws); // Convert sheet to CSV format
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }); // Create Blob for CSV
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); // Create download link
    link.download = `test_${test.TestID}.csv`; // Set the file name
    link.click(); // Trigger download
  };

  return (
    <>
      <div className="container">
        <h2>Test Management</h2>

        {/* Search Bar */}
         <div className="search-container">
          <input
            type="text"
            placeholder="Search by Test Type, Patient ID, etc."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        {/* Filters */}
        {/* <div className="filters">
          <label>Test Type:</label>
          <input
            type="text"
            name="testType"
            value={testType}
            onChange={handleFilterChange}
            placeholder="Test Type"
          />
          <label>Cognitive Score:</label>
          <input
            type="text"
            name="cognitiveScore"
            value={cognitiveScore}
            onChange={handleFilterChange}
            placeholder="Cognitive Score"
          />
          <label>Plaque Presence:</label>
          <input
            type="text"
            name="plaquePresence"
            value={plaquePresence}
            onChange={handleFilterChange}
            placeholder="Plaque Presence"
          />
          <label>Test Date Range:</label>
          <input
            type="date"
            name="startDate"
            value={testDateRange.start}
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="endDate"
            value={testDateRange.end}
            onChange={handleFilterChange}
          />
        </div>  */}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Test ID</th>
              <th>Patient ID</th>
              <th>Test Type</th>
              <th>Beta Amyloid Result</th>
              <th>Plaque Presence</th>
              <th>Cognitive Score</th>
              <th>Test Date</th>
              <th>Test Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTests.map((test) => (
              <tr key={test.TestID}>
                <td>{test.TestID}</td>
                <td>{test.PatientID}</td>
                <td>{test.TestType}</td>
                <td>{test.BetaAmyloidResult}</td>
                <td>{test.PlaquePresence}</td>
                <td>{test.CognitiveScore}</td>
                <td>{new Date(test.TestDate).toLocaleDateString()}</td>
                <td>{test.TestComment}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => exportSingleExcel(test)}
                  >
                    Export Excel
                  </button>
                  <button
                    className="btn btn-secondary ml-2"
                    onClick={() => exportSingleCSV(test)}
                  >
                    Export CSV
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

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
    </>
  );
};

export default TestManagement;
