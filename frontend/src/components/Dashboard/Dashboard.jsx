import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement } from 'chart.js';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement,ArcElement );

const Dashboard = () => {
  const [riskScores, setRiskScores] = useState([]);
  const [cognitiveScores, setCognitiveScores] = useState([]);
  const [lifestyleData, setLifestyleData] = useState([]);

  useEffect(() => {
    // Fetch data for visualizations
    const fetchData = async () => {
      try {
        const riskScoresResponse = await axios.get('/api/risk-scores');
        const cognitiveScoresResponse = await axios.get('/api/cognitive-scores');
        const lifestyleDataResponse = await axios.get('/api/lifestyle');

        setRiskScores(riskScoresResponse.data);
        setCognitiveScores(cognitiveScoresResponse.data);
        setLifestyleData(lifestyleDataResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Data for the risk score distribution (Pie Chart)
  const riskScoreDistributionData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [
          riskScores.filter(score => score <= 3).length,  // Low Risk
          riskScores.filter(score => score > 3 && score <= 6).length,  // Medium Risk
          riskScores.filter(score => score > 6).length,  // High Risk
        ],
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
      },
    ],
  };

  // Data for trends in cognitive scores (Line Chart)
  const cognitiveScoreTrendData = {
    labels: cognitiveScores.map(score => score.date),
    datasets: [
      {
        label: 'Cognitive Score',
        data: cognitiveScores.map(score => score.value),
        borderColor: '#4BC0C0',
        tension: 0.1,
        fill: false,
      },
    ],
  };

  // Data for correlation of lifestyle factors with risk scores (Bar Chart)
  const lifestyleCorrelationData = {
    labels: lifestyleData.map(item => item.diet), // or any other factor
    datasets: [
      {
        label: 'Risk Score Correlation',
        data: lifestyleData.map(item => item.riskScore), // Example: Risk Scores for each lifestyle factor
        backgroundColor: '#FF5733',
      },
    ],
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <div>
        <h2>Risk Score Distribution</h2>
        <Pie data={riskScoreDistributionData} />
      </div>

      <div>
        <h2>Cognitive Score Trends</h2>
        <Line data={cognitiveScoreTrendData} />
      </div>

      <div>
        <h2>Lifestyle Factors & Risk Score Correlation</h2>
        <Bar data={lifestyleCorrelationData} />
      </div>
    </div>
  );
};

export default Dashboard;
