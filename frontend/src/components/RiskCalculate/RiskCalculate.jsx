import React, { useState, useEffect } from "react"; 
import { Pie } from "react-chartjs-2";
import "../../styles/risk.css";

const RiskCalculator = () => {
  const [score, setScore] = useState(null);
  const [riskLevel, setRiskLevel] = useState("");
  const [chartData, setChartData] = useState({});
  const [selectedPatientId, setSelectedPatientId] = useState(1); 
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/api/patients-form")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data from API:", data); 
        if (Array.isArray(data)) {
          setPatients(data); // Store all patients in the state
          const selectedPatient = data.find((item) => item.PatientID === selectedPatientId);
          if (selectedPatient) {
            console.log(`Calculating risk score for patient with ID ${selectedPatientId}:`, selectedPatient);
            calculateRiskScore(selectedPatient); 
          } else {
            console.warn(`Patient with ID ${selectedPatientId} not found.`);
          }
        } else {
          calculateRiskScore(data); 
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [selectedPatientId]);

  const normalizeValue = (value) => {
    if (typeof value === "string") {
      return value.trim().toLowerCase(); // Remove spaces and convert to lowercase
    }
    return value;
  };

  const convertToScore = (type, value) => {
    value = normalizeValue(value);

    if (!value && value !== 0) {
      console.warn(`Missing or undefined value for ${type}`);
      return 0; // Default to 0 for undefined or missing values
    }

    console.log(`Scoring for type: ${type}, value: ${value}`); // Log type and value

    switch (type) {
      case "age":
        if (value >= 65 && value <= 74) return 1;
        if (value >= 75 && value <= 84) return 2;
        if (value >= 85) return 3;
        break;
      case "familyHistory":
        if (value === "none") return 0;
        if (value === "one immediate family member") return 2;
        if (value === "two or more immediate family members") return 4;
        break;
      case "geneticFactors":
        if (value === "no known gene variants") return 0;
        if (value === "apoe-e4") return 3;
        break;
      case "cognitiveScore":
        if (value === 0) return 0;
        if (value >= 1 && value <= 2) return 2;
        if (value > 2) return 4;
        break;
      case "lifestyle":
        if (value === "daily") return 0;
        if (value === "rarely") return 2;
        break;
      case "smokingStatus":
        if (value === "non-smoker") return 0;
        if (value === "former smoker") return 2;
        if (value === "current smoker") return 3;
        break;
      case "diet":
        if (value === "balanced") return 0;
        if (value === "moderate") return 2;
        if (value === "poor") return 3;
        break;
      case "cardiovascularHealth":
        if (value === 0) return 0;
        if (value === 1) return 2;
        if (value === 2) return 3;
        break;
      case "socialEngagement":
        if (value === "active") return 0;
        if (value === "moderate") return 2;
        if (value === "isolated") return 3;
        break;
      case "sleepQuality":
        if (value === "good sleep quality") return 0;
        if (value === "sleep disturbances") return 2;
        if (value === "chronic sleep disorders") return 3;
        break;
      case "betaAmyloid":
        if (value === 0) return 0;
        if (value === 1) return 2;
        if (value === 2) return 4;
        break;
      case "gender":
        if (value === "male") return 0;
        if (value === "female") return 2;
        if (value === "other") return 1;
        break;
      default:
        console.warn(`Unhandled type or value: ${type}, ${value}`);
        return 0;
    }

    console.warn(`No match for ${type} with value: ${value}`);
    return 0;
  };

  const calculateRiskScore = (data) => {
    let totalScore = 0;
    const safeGet = (field, defaultValue = "") => data[field] || defaultValue;

    const addScore = (type, label) => {
      const score = convertToScore(type, safeGet(type));
      console.log(`${label}: ${score}`);
      return score;
    };

    totalScore += addScore("age", "Age");
    totalScore += addScore("familyHistory", "Family History");
    totalScore += addScore("geneticFactors", "Gene APOE4");
    totalScore += addScore("cognitiveScore", "Cognitive Score");
    totalScore += addScore("lifestyle", "Exercise Frequency");
    totalScore += addScore("smokingStatus", "Smoking Status");
    totalScore += addScore("diet", "Diet");
    totalScore += addScore("cardiovascularHealth", "History of Hypertension");
    totalScore += addScore("socialEngagement", "Social Engagement");
    totalScore += addScore("sleepQuality", "Sleep Quality");
    totalScore += addScore("betaAmyloid", "Beta-Amyloid");
    totalScore += addScore("gender", "Gender");

    console.log("Total Score:", totalScore);

    let level = "";
    if (totalScore <= 15) level = "Low Risk";
    else if (totalScore <= 30) level = "Moderate Risk";
    else if (totalScore <= 40) level = "High Risk";
    else level = "Very High Risk";

    setScore(totalScore);
    setRiskLevel(level);
    prepareChartData(level);
  };

  const prepareChartData = (riskLevel) => {
    const riskData = {
      labels: ["Low Risk", "Moderate Risk", "High Risk", "Very High Risk"],
      datasets: [
        {
          data: [0, 0, 0, 0],
          backgroundColor: ["green", "yellow", "orange", "red"],
        },
      ],
    };

    if (riskLevel === "Low Risk") riskData.datasets[0].data = [100, 0, 0, 0];
    else if (riskLevel === "Moderate Risk") riskData.datasets[0].data = [0, 100, 0, 0];
    else if (riskLevel === "High Risk") riskData.datasets[0].data = [0, 0, 100, 0];
    else if (riskLevel === "Very High Risk") riskData.datasets[0].data = [0, 0, 0, 100];

    console.log("Chart Data: ", riskData);
    setChartData(riskData);
  };

  const handlePatientChange = (event) => {
    setSelectedPatientId(Number(event.target.value));
  };

  return (
    <div>
      <h1>Alzheimer's Risk Calculator</h1>
      <div>
        <label>Select Patient ID: </label>
        <select onChange={handlePatientChange} value={selectedPatientId}>
          {patients.map((patient) => (
            <option key={patient.PatientID} value={patient.PatientID}>
              {patient.PatientID}  
            </option>
          ))}
        </select>
      </div>

      {score !== null && (
        <div>
          <h2>Total Risk Score: {score}</h2>
          <h3>Risk Level: {riskLevel}</h3>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ width: "35%", height: "35%" }}>
              <Pie
                data={chartData}
                options={{
                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskCalculator;