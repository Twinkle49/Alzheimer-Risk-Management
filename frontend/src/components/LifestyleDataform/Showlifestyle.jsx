import React, { useState, useEffect } from "react";
import "../../styles/Assess.css";
import * as XLSX from "xlsx"; // Import xlsx

const ShowLifestyleData = () => {
  const [lifestyleData, setLifestyleData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLifestyleData, setFilteredLifestyleData] = useState([]);
  const [lifestylePerPage, setLifestylePerPage] = useState(5); // Data per page
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [filters, setFilters] = useState({
    diet: '',
    smokingStatus: '',
    exerciseFrequency: ''
  });

  // Fetch lifestyle data from API
  useEffect(() => {
    const fetchLifestyleData = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/lifestyle");
        const result = await response.json();
        if (response.ok) {
          setLifestyleData(result);
          setFilteredLifestyleData(result); // Initialize with all lifestyle data
        } else {
          console.error("Error fetching lifestyle data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching lifestyle data:", error);
      }
    };

    fetchLifestyleData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Handle search input change
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    filterLifestyleData(query);
  };

  // Handle filter changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Filter lifestyle data based on search term and filters
  const filterLifestyleData = (query = '') => {
    let filtered = lifestyleData.filter((data) => {
      const matchesSearchTerm =
        data.PatientID.toString().includes(query) ||
        data.Diet.toLowerCase().includes(query) ||
        data.SmokingStatus.toLowerCase().includes(query) ||
        data.ExerciseFrequency.toLowerCase().includes(query);

      const matchesDiet = filters.diet ? data.Diet.toLowerCase().includes(filters.diet.toLowerCase()) : true;
      const matchesSmokingStatus = filters.smokingStatus ? data.SmokingStatus.toLowerCase().includes(filters.smokingStatus.toLowerCase()) : true;
      const matchesExerciseFrequency = filters.exerciseFrequency ? data.ExerciseFrequency.toLowerCase().includes(filters.exerciseFrequency.toLowerCase()) : true;

      return (
        matchesSearchTerm &&
        matchesDiet &&
        matchesSmokingStatus &&
        matchesExerciseFrequency
      );
    });

    setFilteredLifestyleData(filtered);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredLifestyleData.length / lifestylePerPage);
  const indexOfLastData = currentPage * lifestylePerPage;
  const indexOfFirstData = indexOfLastData - lifestylePerPage;
  const currentLifestyleData = filteredLifestyleData.slice(indexOfFirstData, indexOfLastData);

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

  // Handle change in lifestyle data per page
  const handleLifestylePerPageChange = (event) => {
    setLifestylePerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when changing the data per page
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredLifestyleData); // Convert JSON to sheet
    const wb = XLSX.utils.book_new(); // Create new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Lifestyle Data"); // Append sheet to workbook

    // Write to Excel file
    XLSX.writeFile(wb, "lifestyle_data.xlsx");
  };

  // Export to CSV
  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredLifestyleData); // Convert JSON to sheet
    const csv = XLSX.utils.sheet_to_csv(ws); // Convert sheet to CSV format

    // Download CSV file
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "lifestyle_data.csv";
    link.click();
  };

  return (
    <>
      <div className="container">
        <h2>Lifestyle Data</h2>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Patient ID, Diet, Smoking Status, or Exercise Frequency"
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: "50%" }}
            className="search-input"
          />
        </div>

        {/* Filters */}
        {/* <div className="filters">
          <label>Diet:</label>
          <input
            type="text"
            name="diet"
            value={filters.diet}
            onChange={handleFilterChange}
            placeholder="Diet"
          />
          <label>Smoking Status:</label>
          <input
            type="text"
            name="smokingStatus"
            value={filters.smokingStatus}
            onChange={handleFilterChange}
            placeholder="Smoking Status"
          />
          <label>Exercise Frequency:</label>
          <input
            type="text"
            name="exerciseFrequency"
            value={filters.exerciseFrequency}
            onChange={handleFilterChange}
            placeholder="Exercise Frequency"
          />
        </div> */}

        {filteredLifestyleData.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Diet</th>
                  <th>Social Engagement</th>
                  <th>Exercise Frequency</th>
                  <th>Smoking Status</th>
                  <th>Sleep Quality</th>
                  <th>History of Hypertension</th>
                  <th>History of Heart Disease</th>
                  <th>Diabetes Status</th>
                  <th>Data Collected Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentLifestyleData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.PatientID}</td>
                    <td>{data.Diet}</td>
                    <td>{data.SocialEngagement}</td>
                    <td>{data.ExerciseFrequency}</td>
                    <td>{data.SmokingStatus}</td>
                    <td>{data.SleepQuality}</td>
                    <td>{data.HistoryOfHypertension}</td>
                    <td>{data.HistoryOfHeartDisease}</td>
                    <td>{data.DiabetesStatus}</td>
                    <td>{formatDate(data.DataCollectedDate)}</td>
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
          <p>No lifestyle data found.</p>
        )}
      </div>
    </>
  );
};

export default ShowLifestyleData;
