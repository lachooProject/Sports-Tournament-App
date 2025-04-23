import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import Loading from "../components/Ui/LoadingSpinner";
import { showToast } from "../components/Ui/Toastify";
import { useNavigate, Link } from "react-router-dom";
import config from "../../config";

const StatTable = ({ title, playersStats, teamId }) => {
  // Filter players for the current team
  const teamPlayers = playersStats.filter(
    (playerStat) => playerStat.player.teamId === teamId
  );

  return (
    <div className="bg-darkbc rounded-lg sm:p-4 p-2">
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-gray-800">
            <tr>
              <th className="px-4 py-2">Player</th>
              <th className="px-4 py-2">Points</th>
              <th className="px-4 py-2">Smashes</th>
              <th className="px-4 py-2">Aces</th>
            </tr>
          </thead>
          <tbody>
            {teamPlayers.map((player) => (
              <tr key={player.player._id} className="border-b border-gray-600">
                <td className="px-4 py-2 flex items-center gap-2">
                  <img
                    src={player.player.photo}
                    alt="Player"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  {player.player.name || "Player"}
                </td>
                <td className="px-4 py-2">{player.pointsWon || 0}</td>
                <td className="px-4 py-2">{player.smashes || 0}</td>
                <td className="px-4 py-2">{player.aces || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BadmintonScore = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleMatchClick = (TeamId) => {
    navigate(`/teams/${TeamId}`);
  };

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  const fetchMatchDetails = async () => {
    try {
      const response = await fetch(
        `${config.baseUrl}/main/allmatch/${matchId}/badminton`
      );
      const data = await response.json();

      if (response.ok) {
        setMatch(data.data.match);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
      showToast("error", "Failed to load match details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!match) return <div>Match not found</div>;

  const isCompleted = match.status === "completed";

  return (
    <div className="min-h-screen bg-darkbc sm:p-6 p-2">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Match Header */}
        <div className="bg-gray-700 p-4">
          <div className="flex sm:flex-row flex-col justify-between items-center">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                isCompleted ? "bg-green-600" : "bg-blue-600"
              }`}
            >
              {match.status.toUpperCase()}
            </span>
            <span className="text-gray-300">
              {format(new Date(match.date), "MMM dd, yyyy - HH:mm")}
            </span>
          </div>
          <div className="text-gray-400 text-sm mt-2">Venue: {match.venue}</div>
        </div>

        {/* Teams and Score */}
        <div className="sm:p-6 p-3 bg-midnight">
          <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 items-center mb-8">
            {/* Player 1 */}
            <div className="text-center">
              <img
                src={match.team1.photo}
                alt={match.team1.name}
                onClick={() => handleMatchClick(match.team1._id)}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-2"
              />
              <h3 className="text-white font-semibold">{match.team1.name}</h3>
              <div className="mt-2 text-4xl font-bold text-white">
                {match.score.player1}
              </div>
            </div>

            {/* VS */}
            <div className="text-center">
              <span className="text-2xl text-gray-400">VS</span>
            </div>

            {/* Player 2 */}
            <div className="text-center ">
              <img
                src={match.team2.photo}
                alt={match.team2.name}
                onClick={() => handleMatchClick(match.team2._id)}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-2"
              />
              <h3 className="text-white font-semibold">{match.team2.name}</h3>
              <div className="mt-2 text-4xl font-bold text-white">
                {match.score.player2}
              </div>
            </div>
          </div>

          {/* Player Stats */}
          <div className="mt-8">
            {/* Team 1 Stats */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white">
                {match.team1.name} Statistics
              </h2>
              <StatTable
                title="Player Stats"
                playersStats={match.sportSpecific.playerStats}
                teamId={match.team1._id}
              />
            </div>

            {/* Team 2 Stats */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                {match.team2.name} Statistics
              </h2>
              <StatTable
                title="Player Stats"
                playersStats={match.sportSpecific.playerStats}
                teamId={match.team2._id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadmintonScore;
