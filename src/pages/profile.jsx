import React, { useState, useEffect } from "react";
import { FaFutbol } from "react-icons/fa";
import { GiShuttlecock } from "react-icons/gi";
import { Bar, Radar, Line } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import Loading from "../components/Ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register all required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Common chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: { color: "#4B5563" },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: "rgba(156, 163, 175, 0.1)" },
      ticks: { color: "#4B5563" },
    },
    x: {
      grid: { color: "rgba(156, 163, 175, 0.1)" },
      ticks: { color: "#4B5563" },
    },
  },
};

const renderSportStats = (sport, playerData) => {
  const { currentForm, careerStats, visualData } = playerData;

  switch (sport) {
    case "Cricket":
      return (
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <StatCard
              title="Matches"
              value={careerStats.matchesPlayed}
              icon="🏏"
            />
            <StatCard
              title="Win Rate"
              value={`${careerStats.winPercentage}%`}
              icon="📈"
            />
            <StatCard
              title={`${
                playerData.basicInfo.category === "Bowler"
                  ? "Wickets"
                  : "Boundaries"
              }`}
              value={`${
                playerData.basicInfo.category === "Bowler"
                  ? playerData.careerStats.totalWickets.totalWickets
                  : playerData.careerStats.totalBoundaries.totalFours +
                    playerData.careerStats.totalBoundaries.totalSixes
              }`}
              icon={`${
                playerData.basicInfo.category === "Bowler" ? "❌" : "🚀"
              }`}
            />
            <StatCard
              title="Recent Form"
              value={currentForm.recentMatches.batting?.runs[0] || 0}
              icon="🎯"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-400 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                Performance Metrics
              </h3>
              <div className="h-[300px] w-full">
                <Radar
                  options={{
                    ...chartOptions,
                    scales: {
                      r: {
                        min: 0,
                        max: 100,
                        ticks: { stepSize: 20 },
                      },
                    },
                  }}
                  data={{
                    labels: visualData.radarData.labels,
                    datasets: [
                      {
                        label: "Skills Rating",
                        data: visualData.radarData.data,
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        borderColor: "rgb(59, 130, 246)",
                      },
                    ],
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-400 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Recent Performance</h3>
              <div className="h-[300px] w-full">
                <Line
                  options={chartOptions}
                  data={{
                    labels: visualData.performanceHistory.dates,
                    datasets: [
                      {
                        label: "Runs",
                        data: visualData.performanceHistory.batting.runs,
                        borderColor: "rgb(59, 130, 246)",
                        tension: 0.1,
                      },
                      {
                        label: "Economy",
                        data: visualData.performanceHistory.bowling.economy,
                        borderColor: "rgb(16, 185, 129)",
                        tension: 0.1,
                      },
                    ],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );

    case "Football":
      return (
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Goals"
              value={currentForm.recentMatches.attack.goals.reduce(
                (a, b) => a + b,
                0
              )}
              icon="⚽"
            />
            <StatCard
              title="Assists"
              value={currentForm.recentMatches.attack.assists.reduce(
                (a, b) => a + b,
                0
              )}
              icon="👟"
            />
            <StatCard
              title="Tackles"
              value={currentForm.recentMatches.defense.tackles.reduce(
                (a, b) => a + b,
                0
              )}
              icon="🛡️"
            />
            <StatCard
              title="Win Rate"
              value={`${careerStats.winPercentage}%`}
              icon="📈"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-400 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                Performance Analysis
              </h3>
              <div className="h-[300px] w-full">
                <Radar
                  options={{
                    ...chartOptions,
                    scales: {
                      r: {
                        min: 0,
                        max: 100,
                        ticks: { stepSize: 20 },
                      },
                    },
                  }}
                  data={{
                    labels: visualData.radarData.labels,
                    datasets: [
                      {
                        label: "Skills Rating",
                        data: visualData.radarData.data,
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        borderColor: "rgb(59, 130, 246)",
                      },
                    ],
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-400 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Match Performance</h3>
              <div className="h-[300px] w-full">
                <Line
                  options={chartOptions}
                  data={{
                    labels: visualData.performanceHistory.dates,
                    datasets: [
                      {
                        label: "Goals",
                        data: visualData.performanceHistory.attack.goals,
                        borderColor: "rgb(59, 130, 246)",
                        tension: 0.1,
                      },
                      {
                        label: "Assists",
                        data: visualData.performanceHistory.attack.assists,
                        borderColor: "rgb(16, 185, 129)",
                        tension: 0.1,
                      },
                    ],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );

    case "Badminton":
      return (
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Points Won"
              value={currentForm.recentMatches.performance.pointsWon.reduce(
                (a, b) => a + b,
                0
              )}
              icon="🏸"
            />
            <StatCard
              title="Smashes"
              value={currentForm.recentMatches.performance.smashes.reduce(
                (a, b) => a + b,
                0
              )}
              icon="💥"
            />
            <StatCard
              title="Win Rate"
              value={`${careerStats.winPercentage}%`}
              icon="📈"
            />
            <StatCard
              title="Ranking"
              value={`#${careerStats.ranking}`}
              icon="🏆"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-400 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Skill Analysis</h3>
              <div className="h-[300px] w-full">
                <Radar
                  options={{
                    ...chartOptions,
                    scales: {
                      r: {
                        min: 0,
                        max: 100,
                        ticks: { stepSize: 20 },
                      },
                    },
                  }}
                  data={{
                    labels: visualData.radarData.labels,
                    datasets: [
                      {
                        label: "Skills Rating",
                        data: visualData.radarData.data,
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        borderColor: "rgb(59, 130, 246)",
                      },
                    ],
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-400 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Recent Performance</h3>
              <div className="h-[300px] w-full">
                <Line
                  options={chartOptions}
                  data={{
                    labels: visualData.performanceHistory.dates,
                    datasets: [
                      {
                        label: "Points Won",
                        data: visualData.performanceHistory.performance
                          .pointsWon,
                        borderColor: "rgb(59, 130, 246)",
                        tension: 0.1,
                      },
                      {
                        label: "Smashes",
                        data: visualData.performanceHistory.performance.smashes,
                        borderColor: "rgb(16, 185, 129)",
                        tension: 0.1,
                      },
                    ],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return <div>Sport not supported</div>;
  }
};

const PlayerProfile = () => {
  const { playerid } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(playerid);
  const navigate = useNavigate();

  const handleTeamClick = (teamName) => {
    navigate(`/teams/${teamName}`);
  };

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await fetch(
          `${config.baseUrl}/main/player/${playerid}`
        );
        const data = await response.json();
        if (response.ok) {
          setPlayer(data.data.player);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [playerid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center p-4">
        <div className="bg-gray-800/50 rounded-xl p-8 shadow-lg backdrop-blur-sm text-center max-w-md w-full">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full 
              transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  if (!player) return <div>Player not found</div>;

  return (
    <main className="min-h-screen bg-darkbc ">
      {/* Hero Section with Player Info */}
      <div className="w-full bg-white shadow-lg overflow-hidden">
        <div className="relative h-64 bg-gradient-to-r from-dark to-midnight">
          {/* Team Logo Watermark */}
          <div className="absolute right-8 top-8 opacity-0">
            <img
              src={player.basicInfo.teamInfo.photo || "default-team-logo.png"}
              alt={player.basicInfo.teamInfo.name}
              className="w-48 h-48 object-contain"
            />
          </div>

          <div className="absolute -bottom-16 left-8 flex items-end gap-8">
            <div className="bg-white rounded-full">
              <img
                src={player.basicInfo.photo}
                alt={player.basicInfo.name}
                className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-xl"
              />
            </div>
            {/* Team Badge */}
            <div className="mb-4 bg-amber-5">
              <img
                src={player.basicInfo.teamInfo.photo || "default-team-logo.png"}
                alt={player.basicInfo.teamInfo.name}
                className="w-16 h-16 rounded-full border-2 shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="pt-20 pb-6 px-8 bg-gray-400 ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Player Basic Info */}
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold text-gray-900">
                {player.basicInfo.name}
              </h1>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoItem
                  icon="👕"
                  label="Team"
                  value={player.basicInfo.teamInfo.name}
                />
                <InfoItem
                  icon="🎯"
                  label="Category"
                  value={player.basicInfo.category || "N/A"}
                />
                <InfoItem
                  icon="📊"
                  label="Age"
                  value={`${player.basicInfo.age} years`}
                />
                <InfoItem
                  icon="🏆"
                  label="Sport"
                  value={player.basicInfo.sport}
                />
                <InfoItem
                  icon="📈"
                  label="Win Rate"
                  value={`${player.careerStats.winPercentage || 0}%`}
                />
                <InfoItem
                  icon="🎮"
                  label="Matches"
                  value={player.careerStats.matchesPlayed || 0}
                />
              </div>
            </div>

            {/* Rankings & Quick Stats */}
            <div className="bg-gray-300 rounded-lg p-6">
              <div className="text-center">
                <p className="text-5xl font-bold text-blue-600">
                  #{player.careerStats.ranking || "N/A"}
                </p>
                <p className="text-gray-600 mt-2">Current Ranking</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {player.careerStats.wins || 0}
                  </p>
                  <p className="text-sm text-gray-600">Wins</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {player.careerStats.losses || 0}
                  </p>
                  <p className="text-sm text-gray-600">Losses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div
          className="bg-gray-400  rounded-lg shadow-lg p-6 mb-8 cursor-pointer"
          onClick={() => handleTeamClick(player.basicInfo.teamInfo._id)}
        >
          <h2 className="text-2xl font-bold mb-4">Team Information</h2>
          <div className="flex items-center gap-6">
            <img
              src={player.basicInfo.teamInfo.photo || "default-team-logo.png"}
              alt={player.basicInfo.teamInfo.name}
              className="w-24 h-24 rounded-lg object-contain"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {player.basicInfo.teamInfo.name}
              </h3>
              <p className="text-gray-600">{player.basicInfo.sport} Team</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 ">
          {renderSportStats(player.basicInfo.sport, player)}
        </div>
      </div>
    </main>
  );
};

// New InfoItem Component
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    <span className="text-xl">{icon}</span>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const StatCard = ({ title, value, icon }) => (
  <div className="bg-gray-400 rounded-lg p-4 shadow-lg">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="text-2xl font-bold text-blue-600">{value}</p>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-100 py-2">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default PlayerProfile;
