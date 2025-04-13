import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useResponsive } from "../components/Responsive";
import Loading from "../components/Ui/LoadingSpinner";
import { showToast } from "../components/Ui/Toastify";
import { useNavigate } from "react-router-dom";import config from "../../config";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const TeamDetails = () => {
  const { teamId } = useParams();
  const { isMobile, isTablet } = useResponsive();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handlePlayerClick = (playerId) => {
    navigate(`/players/${playerId}`);
  };

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      const response = await fetch(`${config.baseUrl}/main/team/${teamId}`);
      const data = await response.json();

      if (response.ok) {
        setTeam(data.data.team);
        console.log(data.data.team);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get active sports
  const getActiveSports = (sportWiseStats) => {
    return Object.entries(sportWiseStats).filter(
      ([_, stats]) => stats.players > 0
    );
  };

  // Add this after getActiveSports function
  const getPlayerCategories = (players) => {
    const categories = {};
    Object.values(players)
      .flat()
      .forEach((player) => {
        const category = player.category || "Uncategorized";
        categories[category] = (categories[category] || 0) + 1;
      });
    return categories;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <p className="text-white">Team not found</p>
      </div>
    );
  }

  return (
    <div className="bg-darkbc t min-h-screen">
      <div
        className={`container mx-auto p:5 sm:px-4 sm:py-8 ${
          isMobile ? "space-y-4" : "space-y-8"
        }`}
      >
        {/* Team Header */}
        <div className="bg-gray-800 rounded-lg sm:p-8 p-3">
          <div
            className={`${isMobile ? "flex-col" : "flex"} items-center gap-8`}
          >
            <img
              src={team.basicInfo.photo}
              alt={team.basicInfo.name}
              className={`object-contain ${
                isMobile ? "w-32 h-32" : "w-48 h-48"
              }`}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/200?text=Team";
              }}
            />
            <div>
              <h1 className="sm:text-4xl text-2xl font-bold text-white mb-2">
                {team.basicInfo.name}
              </h1>

              {/* Show Primary Sport */}
              <div className="mb-4">
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                  {getActiveSports(team.stats.sportWiseStats)[0]?.[0] ||
                    "No Active Sport"}
                </span>
              </div>

              {/* Active Sports Stats */}
              <div className="mt-4 grid sm:grid-cols-3 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400">Total Players</p>
                  <p className="text-2xl font-bold text-white">
                    {team.stats.totalPlayers}
                  </p>
                </div>
                {getActiveSports(team.stats.sportWiseStats).map(
                  ([sport, stats]) => (
                    <div key={sport} className="bg-gray-700 p-4 rounded-lg">
                      <p className="text-gray-400">{sport} Wins</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.wins}
                      </p>
                      {stats.recentForm.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {stats.recentForm.map((match, index) => (
                            <span
                              key={index}
                              className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
                                match.result === "W"
                                  ? "bg-green-500"
                                  : match.result === "L"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                              }`}
                              title={`vs ${match.opponent} (${match.score})`}
                            >
                              {match.result}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Sport-wise Stats - Only show active sports */}
          <div className="mt-8">
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4">
                Performance by Sport
              </h3>
              <div className="grid gap-4">
                {getActiveSports(team.stats.sportWiseStats).map(
                  ([sport, stats]) => (
                    <div key={sport} className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-white text-lg font-semibold mb-3">
                        {sport}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="bg-gray-700 p-3 rounded">
                          <span className="text-gray-400 text-sm">Players</span>
                          <p className="text-white font-bold text-xl">
                            {stats.players}
                          </p>
                        </div>
                        <div className="bg-gray-700 p-3 rounded">
                          <span className="text-gray-400 text-sm">Wins</span>
                          <p className="text-white font-bold text-xl">
                            {stats.wins}
                          </p>
                        </div>
                        <div className="bg-gray-700 p-3 rounded">
                          <span className="text-gray-400 text-sm">
                            Win Rate
                          </span>
                          <p className="text-white font-bold text-xl">
                            {(
                              (stats.wins / (stats.recentForm.length || 1)) *
                              100
                            ).toFixed(1)}
                            %
                          </p>
                        </div>
                      </div>
                      {stats.recentForm.length > 0 && (
                        <div className="mt-3">
                          <span className="text-gray-400 text-sm mb-2 block">
                            Recent Form
                          </span>
                          <div className="flex gap-1">
                            {stats.recentForm.map((match, index) => (
                              <span
                                key={index}
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                                  match.result === "W"
                                    ? "bg-green-500"
                                    : match.result === "L"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                                }`}
                                title={`vs ${match.opponent} (${match.score})`}
                              >
                                {match.result}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Players Section - Only show active sports */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Team Players</h2>
            {getActiveSports(team.stats.sportWiseStats).map(
              ([sport]) =>
                team.players[sport].length > 0 && (
                  <div key={sport} className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {sport}
                    </h3>
                    <div
                      className={`grid gap-6 ${
                        isMobile
                          ? "grid-cols-1"
                          : isTablet
                          ? "grid-cols-2"
                          : "grid-cols-3"
                      }`}
                    >
                      {team.players[sport].map((player) => (
                        <div
                          key={player._id}
                          className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                          onClick={() => handlePlayerClick(player._id)}
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={player.photo}
                              alt={player.name}
                              className="w-20 h-20 rounded-full object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/80?text=Player";
                              }}
                            />
                            <div>
                              <h3 className="text-white font-semibold text-lg">
                                {player.name}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                Age: {player.age || "N/A"}
                              </p>
                              <p className="text-gray-400 text-sm">
                                Category: {player.category || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>

          {/* Add this after the Players Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Player Categories Distribution
            </h2>
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="h-[400px] w-full">
                <Pie
                  data={{
                    labels: Object.keys(getPlayerCategories(team.players)),
                    datasets: [
                      {
                        data: Object.values(getPlayerCategories(team.players)),
                        backgroundColor: [
                          "rgba(54, 162, 235, 0.8)",
                          "rgba(255, 99, 132, 0.8)",
                          "rgba(255, 206, 86, 0.8)",
                          "rgba(75, 192, 192, 0.8)",
                          "rgba(153, 102, 255, 0.8)",
                        ],
                        borderColor: [
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 99, 132, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                          "rgba(153, 102, 255, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                        labels: {
                          color: "white",
                          font: {
                            size: 14,
                          },
                        },
                      },
                      title: {
                        display: true,
                        text: "Player Categories",
                        color: "white",
                        font: {
                          size: 16,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
