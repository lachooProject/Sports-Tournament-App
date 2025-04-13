import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import config from "../../config";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Radar, Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// Add this validation helper function at the top of your component
const validateComparisonData = (data, sport) => {
  if (!data || !data.player1 || !data.player2) return false;
  
  // Basic validation for all sports
  const basicValidation = 
    data.player1.basicInfo &&
    data.player2.basicInfo &&
    data.visualData &&
    data.visualData.labels &&
    data.visualData.player1Data &&
    data.visualData.player2Data;

  if (!basicValidation) return false;

  // Sport-specific validation
  switch (sport) {
    case "Cricket":
      return data.comparison && data.comparison.batting && data.comparison.bowling;
    case "Football":
      return data.comparison && data.comparison.attack && data.comparison.defense;
    case "Badminton":
      return data.comparison && data.comparison.technical;
    default:
      return false;
  }
};

function Analytics() {
  const [selectedSport, setSelectedSport] = useState("Cricket");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlayer1, setSelectedPlayer1] = useState("");
  const [selectedPlayer2, setSelectedPlayer2] = useState("");
  const [comparisonData, setComparisonData] = useState(null);

  const sports = [
    { id: "Cricket", name: "Cricket" },
    { id: "Football", name: "Football" },
    { id: "Badminton", name: "Badminton" },
  ];
  useEffect(() => {
    document.title = "LFC || Analytics";
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!selectedSport) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${config.baseUrl}/main/allplayers?sports=${selectedSport}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }
        const data = await response.json();
        setPlayers(data.data || []); // Assuming the API returns data in { data: [...players] } format
      } catch (error) {
        console.error("Error fetching players:", error);
        setError("Failed to load players. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [selectedSport]);

  // Update the fetchComparison function
  const fetchComparison = async () => {
    if (!selectedPlayer1 || !selectedPlayer2) return;

    try {
      setLoading(true);
      setError(null);
      setComparisonData(null); // Clear previous data

      const response = await fetch(
        `${config.baseUrl}/main/compare?sport=${selectedSport}&player1=${selectedPlayer1}&player2=${selectedPlayer2}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch comparison data");
      }
      
      const data = await response.json();
      
      // Validate the data structure
      if (!validateComparisonData(data.data, selectedSport)) {
        throw new Error("Invalid comparison data structure");
      }

      setComparisonData(data.data);
    } catch (error) {
      console.error("Error fetching comparison:", error);
      setError(`Failed to load comparison data: ${error.message}`);
      setComparisonData(null);
    } finally {
      setLoading(false);
    }
  };

  // Update the useEffect for player selection
  useEffect(() => {
    if (selectedPlayer1 && selectedPlayer2) {
      fetchComparison();
    } else {
      setComparisonData(null);
      setError(null);
    }
  }, [selectedPlayer1, selectedPlayer2, selectedSport]);

  const renderFootballStats = () => {
    if (!comparisonData) return null;

    const radarData = {
      labels: comparisonData.visualData.labels,
      datasets: [
        {
          label: comparisonData.player1.basicInfo.name,
          data: comparisonData.visualData.player1Data,
          fill: true,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgb(54, 162, 235)",
          pointBackgroundColor: "rgb(54, 162, 235)",
          pointBorderColor: "#fff",
        },
        {
          label: comparisonData.player2.basicInfo.name,
          data: comparisonData.visualData.player2Data,
          fill: true,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgb(255, 99, 132)",
          pointBackgroundColor: "rgb(255, 99, 132)",
          pointBorderColor: "#fff",
        },
      ],
    };

    return (
      <div className="mt-8">
        {/* Player Basic Info Cards */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {[comparisonData.player1, comparisonData.player2].map((player, idx) => (
            <div key={idx} className="bg-midnight rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={player.basicInfo.photo}
                  alt={player.basicInfo.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {player.basicInfo.name}
                  </h3>
                  <p className="text-gray-400">Age: {player.basicInfo.age}</p>
                  <p className="text-gray-400">
                    Team: {player.basicInfo.team.name}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">
                    {player.careerStats.matchesPlayed}
                  </p>
                  <p className="text-sm text-gray-400">Matches</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">
                    {player.careerStats.wins}
                  </p>
                  <p className="text-sm text-gray-400">Wins</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">
                    {player.careerStats.winPercentage}%
                  </p>
                  <p className="text-sm text-gray-400">Win Rate</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Radar Chart */}
        <div className="bg-midnight p-6 rounded-lg mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Overall Comparison</h3>
          <div className="h-[400px]">
            <Radar
              data={radarData}
              options={{
                scales: {
                  r: {
                    min: 0,
                    max: 100,
                    ticks: { color: "white" },
                    grid: { color: "rgba(255, 255, 255, 0.1)" },
                    pointLabels: { color: "white" },
                  },
                },
                plugins: {
                  legend: {
                    labels: { color: "white" },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Match Statistics */}
        <div className="bg-midnight rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Match Statistics</h3>
          <div className="grid grid-cols-2 gap-8">
            {[comparisonData.player1, comparisonData.player2].map((player, idx) => (
              <div key={idx} className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">{player.basicInfo.name}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-700/50 rounded">
                    <p className="text-2xl font-bold text-white">{player.careerStats.matchesPlayed}</p>
                    <p className="text-sm text-gray-400">Matches</p>
                  </div>
                  <div className="text-center p-3 bg-gray-700/50 rounded">
                    <p className="text-2xl font-bold text-white">{player.careerStats.winPercentage}%</p>
                    <p className="text-sm text-gray-400">Win Rate</p>
                  </div>
                  <div className="text-center p-3 bg-gray-700/50 rounded">
                    <p className="text-2xl font-bold text-white">{player.careerStats.wins}</p>
                    <p className="text-sm text-gray-400">Wins</p>
                  </div>
                  <div className="text-center p-3 bg-gray-700/50 rounded">
                    <p className="text-2xl font-bold text-white">{player.careerStats.losses}</p>
                    <p className="text-sm text-gray-400">Losses</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attack Stats */}
        <div className="bg-midnight rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Attack Statistics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(comparisonData.comparison.attack).map(([key, value]) => (
              <div key={key} className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="flex justify-between items-center">
                  <div className="text-center w-1/2">
                    <p className="text-2xl font-bold text-blue-400">{value.player1}</p>
                    <p className="text-sm text-gray-400">{comparisonData.player1.basicInfo.name}</p>
                  </div>
                  <div className="text-center w-1/2">
                    <p className="text-2xl font-bold text-pink-400">{value.player2}</p>
                    <p className="text-sm text-gray-400">{comparisonData.player2.basicInfo.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Defense Stats */}
        <div className="bg-midnight rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Defense Statistics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(comparisonData.comparison.defense).map(([key, value]) => (
              <div key={key} className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="flex justify-between items-center">
                  <div className="text-center w-1/2">
                    <p className="text-2xl font-bold text-blue-400">{value.player1}</p>
                    <p className="text-sm text-gray-400">{comparisonData.player1.basicInfo.name}</p>
                  </div>
                  <div className="text-center w-1/2">
                    <p className="text-2xl font-bold text-pink-400">{value.player2}</p>
                    <p className="text-sm text-gray-400">{comparisonData.player2.basicInfo.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Info */}
        <div className="bg-midnight rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Team Information</h3>
          <div className="grid grid-cols-2 gap-8">
            {[comparisonData.player1, comparisonData.player2].map((player, idx) => (
              <div key={idx} className="bg-gray-800/50 rounded-lg p-4 flex items-center space-x-4">
                {player.basicInfo.team.logo && (
                  <img 
                    src={player.basicInfo.team.logo} 
                    alt={player.basicInfo.team.name}
                    className="w-16 h-16 object-contain"
                  />
                )}
                <div>
                  <h4 className="text-lg font-semibold text-white">{player.basicInfo.team.name}</h4>
                  <p className="text-sm text-gray-400">{player.basicInfo.name}'s Current Team</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Discipline Stats */}
        <div className="bg-midnight rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Discipline Statistics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(comparisonData.comparison.discipline).map(([key, value]) => (
              <div key={key} className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="flex justify-between items-center">
                  <div className="text-center w-1/2">
                    <p className="text-2xl font-bold text-blue-400">{value.player1}</p>
                    <p className="text-sm text-gray-400">{comparisonData.player1.basicInfo.name}</p>
                  </div>
                  <div className="text-center w-1/2">
                    <p className="text-2xl font-bold text-pink-400">{value.player2}</p>
                    <p className="text-sm text-gray-400">{comparisonData.player2.basicInfo.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBadmintonStats = () => {
    if (!comparisonData) return null;

    // Calculate additional performance metrics
    const getPerformanceMetrics = (player) => {
      const wins = player.careerStats.wins;
      const total = player.careerStats.matchesPlayed;
      return {
        consistency: ((wins / total) * 100 || 0).toFixed(1),
        form: wins > 0 ? "Good" : "Needs Improvement",
      };
    };

    const player1Metrics = getPerformanceMetrics(comparisonData.player1);
    const player2Metrics = getPerformanceMetrics(comparisonData.player2);

    const radarData = {
      labels: comparisonData.visualData.labels,
      datasets: [
        {
          label: comparisonData.player1.basicInfo.name,
          data: comparisonData.visualData.player1Data,
          fill: true,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgb(54, 162, 235)",
          pointBackgroundColor: "rgb(54, 162, 235)",
          pointBorderColor: "#fff",
        },
        {
          label: comparisonData.player2.basicInfo.name,
          data: comparisonData.visualData.player2Data,
          fill: true,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgb(255, 99, 132)",
          pointBackgroundColor: "rgb(255, 99, 132)",
          pointBorderColor: "#fff",
        },
      ],
    };

    return (
      <div className="mt-8">
        {/* Player Basic Info Cards */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {[comparisonData.player1, comparisonData.player2].map((player, idx) => (
            <div key={idx} className="bg-midnight rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={player.basicInfo.photo}
                  alt={player.basicInfo.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {player.basicInfo.name}
                  </h3>
                  <p className="text-gray-400">Age: {player.basicInfo.age}</p>
                  <p className="text-gray-400">
                    Team: {player.basicInfo.team.name}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-white">
                    {player.careerStats.winPercentage}%
                  </p>
                  <p className="text-sm text-gray-400">Win Rate</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-white">
                    {player.careerStats.matchesPlayed}
                  </p>
                  <p className="text-sm text-gray-400">Matches Played</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Radar Chart */}
        <div className="bg-midnight rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Performance Overview</h3>
          <div className="h-[400px]">
            <Radar
              data={radarData}
              options={{
                scales: {
                  r: {
                    min: 0,
                    max: 100,
                    ticks: { color: "white" },
                    grid: { color: "rgba(255, 255, 255, 0.1)" },
                    pointLabels: { color: "white" },
                  },
                },
                plugins: {
                  legend: {
                    labels: { color: "white" },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Match Statistics */}
        <div className="bg-midnight rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Match Statistics</h3>
          <div className="grid grid-cols-2 gap-8">
            {[comparisonData.player1, comparisonData.player2].map((player, idx) => (
              <div key={idx} className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">
                  {player.basicInfo.name}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-700/50 rounded">
                    <p className="text-2xl font-bold text-white">
                      {player.careerStats.wins}
                    </p>
                    <p className="text-sm text-gray-400">Wins</p>
                  </div>
                  <div className="text-center p-3 bg-gray-700/50 rounded">
                    <p className="text-2xl font-bold text-white">
                      {player.careerStats.losses}
                    </p>
                    <p className="text-sm text-gray-400">Losses</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Technical Skills */}
        <div className="bg-midnight rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Technical Skills Analysis</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(comparisonData.comparison.technical).map(([key, value]) => (
              <div key={key} className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-blue-400">{value.player1}</p>
                    <p className="text-sm text-gray-400">{comparisonData.player1.basicInfo.name}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-pink-400">{value.player2}</p>
                    <p className="text-sm text-gray-400">{comparisonData.player2.basicInfo.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New: Detailed Performance Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {[
            { player: comparisonData.player1, metrics: player1Metrics },
            { player: comparisonData.player2, metrics: player2Metrics }
          ].map((data, idx) => (
            <div key={idx} className="bg-midnight rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                {data.player.basicInfo.name}'s Performance Analysis
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Consistency Rating</p>
                  <p className="text-2xl font-bold text-white">{data.metrics.consistency}%</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Current Form</p>
                  <p className="text-2xl font-bold text-white">{data.metrics.form}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Win/Loss Ratio</p>
                  <p className="text-2xl font-bold text-white">
                    {data.player.careerStats.wins}:{data.player.careerStats.losses}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Career Matches</p>
                  <p className="text-2xl font-bold text-white">
                    {data.player.careerStats.matchesPlayed}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New: Key Statistics Comparison */}
        <div className="bg-midnight rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Key Statistics Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisonData.visualData.labels.map((label, index) => (
              <div key={label} className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">{label}</h4>
                <div className="flex justify-between items-center">
                  <div className="text-center w-1/2">
                    <p className="text-2xl font-bold text-blue-400">
                      {comparisonData.visualData.player1Data[index]}%
                    </p>
                    <p className="text-sm text-gray-400">{comparisonData.player1.basicInfo.name}</p>
                  </div>
                  <div className="text-center w-1/2">
                    <p className="text-2xl font-bold text-pink-400">
                      {comparisonData.visualData.player2Data[index]}%
                    </p>
                    <p className="text-sm text-gray-400">{comparisonData.player2.basicInfo.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New: Team Information */}
        <div className="bg-midnight rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Team Information</h3>
          <div className="grid grid-cols-2 gap-8">
            {[comparisonData.player1, comparisonData.player2].map((player, idx) => (
              <div key={idx} className="bg-gray-800/50 rounded-lg p-4 flex items-center space-x-4">
                {player.basicInfo.team.logo && (
                  <img 
                    src={player.basicInfo.team.logo} 
                    alt={player.basicInfo.team.name}
                    className="w-16 h-16 object-contain"
                  />
                )}
                <div>
                  <h4 className="text-lg font-semibold text-white">{player.basicInfo.team.name}</h4>
                  <p className="text-sm text-gray-400">Current Team</p>
                  <p className="text-sm text-gray-400">Player: {player.basicInfo.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Update the renderComparisonStats function
  const renderComparisonStats = () => {
    if (!comparisonData || loading) return null;

    try {
      switch (selectedSport) {
        case "Football":
          return renderFootballStats();
        case "Badminton":
          return renderBadmintonStats();
        case "Cricket":
          return renderCricketStats();
        default:
          throw new Error(`Unsupported sport: ${selectedSport}`);
      }
    } catch (error) {
      console.error("Error rendering comparison stats:", error);
      return (
        <div className="mt-8 p-4 bg-red-900/50 rounded-lg">
          <p className="text-red-200">
            Error displaying comparison data. Please try again or contact support.
          </p>
        </div>
      );
    }
  };

  const renderCricketStats = () => {
    if (!comparisonData) return null;

    const radarData = {
      labels: comparisonData.visualData.labels,
      datasets: [
        {
          label: comparisonData.player1.basicInfo.name,
          data: comparisonData.visualData.player1Data,
          fill: true,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgb(54, 162, 235)",
          pointBackgroundColor: "rgb(54, 162, 235)",
          pointBorderColor: "#fff",
        },
        {
          label: comparisonData.player2.basicInfo.name,
          data: comparisonData.visualData.player2Data,
          fill: true,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgb(255, 99, 132)",
          pointBackgroundColor: "rgb(255, 99, 132)",
          pointBorderColor: "#fff",
        },
      ],
    };

    return (
      <div className="mt-8">
        {/* Player Basic Info Cards */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {[comparisonData.player1, comparisonData.player2].map(
            (player, idx) => (
              <div key={idx} className="bg-midnight rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={player.basicInfo.photo}
                    alt={player.basicInfo.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {player.basicInfo.name}
                    </h3>
                    <p className="text-gray-400">Age: {player.basicInfo.age}</p>
                    <p className="text-gray-400">
                      Team: {player.basicInfo.team.name}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">
                      {player.careerStats.matchesPlayed}
                    </p>
                    <p className="text-sm text-gray-400">Matches</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">
                      {player.careerStats.wins}
                    </p>
                    <p className="text-sm text-gray-400">Wins</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">
                      {player.careerStats.winPercentage}%
                    </p>
                    <p className="text-sm text-gray-400">Win Rate</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Radar Chart */}
        <div className="bg-midnight p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">
            Overall Comparison
          </h3>
          <div className="h-[400px]">
            <Radar
              data={radarData}
              options={{
                scales: {
                  r: {
                    min: 0,
                    max: 100,
                    ticks: { color: "white" },
                    grid: { color: "rgba(255, 255, 255, 0.1)" },
                    pointLabels: { color: "white" },
                  },
                },
                plugins: {
                  legend: {
                    labels: { color: "white" },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Batting Stats with Detailed Information */}
        <div className="bg-midnight rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">
            Batting Statistics
          </h3>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-3">
                Overall Performance
              </h4>
              {Object.entries(comparisonData.comparison.batting.overall).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center border-b border-gray-700 pb-2"
                  >
                    <span className="text-gray-400 capitalize">{key}</span>
                    <div className="flex space-x-8">
                      <span className="text-blue-400 w-20 text-right">
                        {value.player1}
                      </span>
                      <span className="text-pink-400 w-20 text-right">
                        {value.player2}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Boundaries Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-3">
                Boundaries
              </h4>
              {Object.entries(comparisonData.comparison.batting.boundaries).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center border-b border-gray-700 pb-2"
                  >
                    <span className="text-gray-400 capitalize">
                      {key === "boundaryPercentage" ? "Boundary %" : key}
                    </span>
                    <div className="flex space-x-8">
                      <span className="text-blue-400 w-20 text-right">
                        {value.player1}
                      </span>
                      <span className="text-pink-400 w-20 text-right">
                        {value.player2}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Dismissals Section */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-white mb-3">
              Dismissal Types
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(comparisonData.comparison.batting.dismissals).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center border-b border-gray-700 pb-2"
                  >
                    <span className="text-gray-400 capitalize">{key}</span>
                    <div className="flex space-x-8">
                      <span className="text-blue-400 w-16 text-right">
                        {value.player1}
                      </span>
                      <span className="text-pink-400 w-16 text-right">
                        {value.player2}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Bar Chart for Boundaries Comparison */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-white mb-3">
              Boundaries Comparison
            </h4>
            <div className="h-[300px]">
              <Bar
                data={{
                  labels: ["Fours", "Sixes"],
                  datasets: [
                    {
                      label: comparisonData.player1.basicInfo.name,
                      data: [
                        comparisonData.comparison.batting.boundaries.fours
                          .player1,
                        comparisonData.comparison.batting.boundaries.sixes
                          .player1,
                      ],
                      backgroundColor: "rgba(54, 162, 235, 0.8)",
                    },
                    {
                      label: comparisonData.player2.basicInfo.name,
                      data: [
                        comparisonData.comparison.batting.boundaries.fours
                          .player2,
                        comparisonData.comparison.batting.boundaries.sixes
                          .player2,
                      ],
                      backgroundColor: "rgba(255, 99, 132, 0.8)",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                      },
                      ticks: {
                        color: "white",
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: "white",
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: "white",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Bowling Stats */}
        <div className="bg-midnight rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Bowling Comparison
          </h3>
          <div className="grid grid-cols-2 gap-8">
            {Object.entries(comparisonData.comparison.bowling.overall).map(
              ([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-400 capitalize">{key}</span>
                  <div className="flex space-x-8">
                    <span className="text-blue-400">{value.player1}</span>
                    <span className="text-pink-400">{value.player2}</span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  // Update the sport selection handler
  const handleSportChange = (sportId) => {
    setSelectedSport(sportId);
    setSelectedPlayer1("");
    setSelectedPlayer2("");
    setComparisonData(null);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-darkbc">
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1
              className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-red-400 to-yellow-300 
              bg-clip-text text-transparent tracking-tight leading-tight font-bold"
            >
              Compare Players
            </h1>

            {/* Sports Selection */}
            <div className="flex justify-center gap-4 mt-8">
              {sports.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => handleSportChange(sport.id)}
                  className={`px-6 py-3 rounded-lg transition-all ${
                    selectedSport === sport.id
                      ? "bg-miniaccent text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {sport.name}
                </button>
              ))}
            </div>

            {/* Player Selection Dropdowns */}
            {!loading && !error && players.length > 0 && (
              <div className="flex justify-center gap-8 mt-8">
                {/* First Player Dropdown */}
                <div className="w-64">
                  <select
                    value={selectedPlayer1}
                    onChange={(e) => setSelectedPlayer1(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-miniaccent"
                  >
                    <option value="">Select Player 1</option>
                    {players.map((player) => (
                      <option key={player._id} value={player._id}>
                        {player.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Second Player Dropdown */}
                <div className="w-64">
                  <select
                    value={selectedPlayer2}
                    onChange={(e) => setSelectedPlayer2(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-miniaccent"
                  >
                    <option value="">Select Player 2</option>
                    {players.map((player) => (
                      <option key={player._id} value={player._id}>
                        {player.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Add this before renderComparisonStats() */}
            {loading && (
              <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-4 h-4 bg-miniaccent rounded-full animate-bounce" />
                  <div className="w-4 h-4 bg-miniaccent rounded-full animate-bounce delay-100" />
                  <div className="w-4 h-4 bg-miniaccent rounded-full animate-bounce delay-200" />
                </div>
                <p className="text-gray-400 text-center mt-2">
                  Loading comparison data...
                </p>
              </div>
            )}

            {error && (
              <div className="mt-8 p-4 bg-red-900/50 rounded-lg">
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {!loading &&
              !error &&
              selectedPlayer1 &&
              selectedPlayer2 &&
              renderComparisonStats()}

            {/* Comparison Stats */}
            {selectedPlayer1 && selectedPlayer2 && renderComparisonStats()}

            {/* Error Message */}
            {error && <div className="text-red-500 mt-4">{error}</div>}

            {/* Loading State */}
            {loading && (
              <div className="text-white mt-8">Loading players...</div>
            )}

            {/* Players List */}
            {!loading && !error && players.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {players.map((player) => (
                  <div
                    key={player._id}
                    className="bg-midnight p-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <h3 className="text-white text-xl mb-2">{player.name}</h3>
                    <div className="text-gray-300">
                      <p>Team: {player.teamName}</p>
                      <p>Category: {player.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Players Message */}
            {!loading && !error && players.length === 0 && selectedSport && (
              <div className="text-gray-400 mt-8">
                No players found for {selectedSport}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Analytics;