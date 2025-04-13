import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../../components/Ui/LoadingSpinner";
import { showToast } from "../../../components/Ui/Toastify";
import config from "../../../../config";

const BadmintonEdit = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [playerStats, setPlayerStats] = useState([]);
  const [updatingScore, setUpdatingScore] = useState(false);
  const [isPointWon, setIsPointWon] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchMatchDetails();
    const intervalId = setInterval(fetchMatchDetails, 5000);
    return () => clearInterval(intervalId);
  }, [matchId]);

  const fetchMatchDetails = async () => {
    try {
      const response = await fetch(
        `${config.baseUrl}/matchscore/badmintonMatches/${matchId}`
      );
      const data = await response.json();
      if (response.ok) {
        setMatchDetails(data.data.match);
        setPlayerStats(data.data.match.playersStats || []);
        console.log(data.data.match);
        console.log(data.data.match.playersStats);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreUpdate = async () => {
    if (!selectedPlayer) {
      showToast("error", "Please select a player");
      return;
    }

    if (!selectedAction) {
      showToast("error", "Please select an action");
      return;
    }

    setUpdatingScore(true);
    try {
      const response = await fetch(
        `${config.baseUrl}/matchscore/batmintonMatches/ballstats/${matchId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playerId: selectedPlayer,
            eventType: selectedAction,
            isPointWon: isPointWon,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        showToast("success", "Score updated successfully");
        setSelectedAction("");
        setIsPointWon(true); // Reset to default
        fetchMatchDetails();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setUpdatingScore(false);
    }
  };

  const handleCompleteMatch = async () => {
    setCompleting(true);
    try {
      const response = await fetch(
        `${config.baseUrl}/matchScore/badmintonMatches/status/${matchId}?status=completed`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        showToast("success", "Match completed successfully");
        // Navigate back to match maintenance page
        navigate("/admin/matchscoremaintain", { replace: true });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <main className="bg-darkbc text-white flex justify-center">
      <div className="min-h-screen xl:w-[70%] bg-darkbc text-white p-6">
        {/* Add Complete Match Button at the top */}
        <div className="mb-6">
          <button
            onClick={handleCompleteMatch}
            disabled={completing}
            className="w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {completing ? (
              <div className="flex items-center justify-center">
                <Loading />
                <span className="ml-2">Completing Match...</span>
              </div>
            ) : (
              "Complete Match"
            )}
          </button>
        </div>

        {/* Match Header */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h1 className="text-2xl font-bold text-center mb-2">
            {matchDetails?.team1Name} vs {matchDetails?.team2Name}
          </h1>
          <p className="text-center text-gray-400">
            Venue: {matchDetails?.venue}
          </p>
          <p className="text-center text-gray-400">
            Date: {new Date(matchDetails?.date).toLocaleDateString()}
          </p>
        </div>

        {/* Score Display */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 mb-6 shadow-xl border border-gray-700">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center p-4 bg-gray-800 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-bold text-xl mb-2 text-blue-400">
                {matchDetails?.team1Name}
              </h3>
              <p className="text-4xl font-bold text-white">
                {matchDetails?.score?.player1 || 0}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg border-r-4 border-blue-500">
              <h3 className="font-bold text-xl mb-2 text-blue-400">
                {matchDetails?.team2Name}
              </h3>
              <p className="text-4xl font-bold text-white">
                {matchDetails?.score?.player2 || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Player Selection - Updated to use playerStats directly */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 mb-6 shadow-xl border border-gray-700">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-lg font-medium text-gray-200 mb-2">
                Select Player
              </label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
              >
                <option value="">Select Player</option>
                {playerStats.map((playerStat) => (
                  <option key={playerStat._id} value={playerStat.player}>
                    {`${playerStat.playerName} (Points: ${
                      playerStat.pointsWon || 0
                    }, Aces: ${playerStat.aces || 0}, Smash: ${
                      playerStat.smash || 0
                    }, Net Play: ${playerStat.netPlay || 0})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Selection */}
        {selectedPlayer && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 shadow-xl border border-gray-700">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Action
                </label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4"
                >
                  <option value="">Select Action</option>
                  <option value="point">Add Point (+1)</option>
                  <option value="ace">Ace</option>
                  <option value="smash">Smash</option>
                  <option value="netPlay">Net Play</option>
                </select>

                {/* Point Won/Lost Toggle */}
                <div className="flex items-center gap-4 mb-4">
                  <label className="text-sm font-medium text-gray-300">
                    Point Result:
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPointWon(true)}
                      className={`px-4 py-2 rounded-lg ${
                        isPointWon
                          ? "bg-green-600 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      Won
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPointWon(false)}
                      className={`px-4 py-2 rounded-lg ${
                        !isPointWon
                          ? "bg-red-600 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      Lost
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleScoreUpdate}
                  disabled={!selectedAction || updatingScore}
                  className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                  {updatingScore ? (
                    <div className="flex flex-col items-center justify-center">
                      <Loading />
                      <span className="ml-2">Recording Action...</span>
                    </div>
                  ) : (
                    "Record Action"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default BadmintonEdit;
