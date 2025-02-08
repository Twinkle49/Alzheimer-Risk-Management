import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Slider from 'react-slider';
import { useTable, useSortBy } from 'react-table';
import { saveAs } from 'file-saver';
import XLSX from 'xlsx';

const SearchPage = () => {
  const [filters, setFilters] = useState({
    gender: null,
    ageRange: [0, 100],
  });

  const [data, setData] = useState([]);
  
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Age',
        accessor: 'age',
      },
      {
        Header: 'Gender',
        accessor: 'gender',
      },
      {
        Header: 'Family History',
        accessor: 'familyHistory',
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  }, useSortBy);

  const handleGenderChange = (selectedOption) => {
    setFilters({ ...filters, gender: selectedOption });
  };

  const handleAgeChange = (values) => {
    setFilters({ ...filters, ageRange: values });
  };

  const handleSearch = async () => {
    // API call based on the filters
    const response = await fetch('/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    });
    const result = await response.json();
    setData(result);
  };

  const exportCSV = () => {
    const csvData = data.map(row => ({
      Name: row.name,
      Age: row.age,
      Gender: row.gender,
      'Family History': row.familyHistory,
    }));

    const csvContent = [
      ['Name', 'Age', 'Gender', 'Family History'],
      ...csvData.map(row => Object.values(row)),
    ];

    let csvFile = '';
    csvContent.forEach(row => {
      csvFile += row.join(',') + '\n';
    });

    const blob = new Blob([csvFile], { type: 'text/csv' });
    saveAs(blob, 'patients.csv');
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Patients');
    XLSX.writeFile(wb, 'patients.xlsx');
  };

  useEffect(() => {
    handleSearch();
  }, [filters]);

  return (
    <div>
      <h1>Search Page</h1>

      {/* Filters */}
      <div>
        <h3>Filter by:</h3>
        <Select
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
          ]}
          onChange={handleGenderChange}
          placeholder="Select Gender"
        />
        <br />
        <label>Age Range</label>
        <Slider
          min={0}
          max={100}
          step={1}
          value={filters.ageRange}
          onChange={handleAgeChange}
        />
        <br />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Table */}
      <table {...getTableProps()} style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{ padding: '10px', cursor: 'pointer', border: '1px solid #ccc' }}
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} style={{ padding: '10px', border: '1px solid #ccc' }}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Export Buttons */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={exportCSV}>Export to CSV</button>
        <button onClick={exportExcel}>Export to Excel</button>
      </div>
    </div>
  );
};

export default SearchPage;
