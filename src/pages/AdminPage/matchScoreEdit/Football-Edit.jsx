import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../../components/Ui/LoadingSpinner";
import { showToast } from "../../../components/Ui/Toastify";
import config from "../../../../config";

const FootballEdit = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [players, setPlayers] = useState([]);
  const [updatingScore, setUpdatingScore] = useState(false);
  const [playerStats, setPlayerStats] = useState([]);
  const [selectedAction, setSelectedAction] = useState("");
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!matchId) {
      navigate("/admin/matchscoremaintain");
      return;
    }

    fetchMatchDetails();
    const intervalId = setInterval(fetchMatchDetails, 5000);
    return () => clearInterval(intervalId);
  }, [matchId]);

  const fetchMatchDetails = async () => {
    try {
      const response = await fetch(
        `${config.baseUrl}/matchscore/footballMatches/${matchId}`
      );
      const data = await response.json();
      if (response.ok) {
        setMatchDetails(data.data.match);
        console.log(data.data.match);
        setPlayerStats(data.data.match.playersStats || []);
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
        `${config.baseUrl}/matchscore/footballMatches/ballstats/${matchId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playerId: selectedPlayer,
            eventType: selectedAction,
          }),
        }
      );

      console.log("data" + selectedPlayer);
      console.log("data" + selectedAction);
      console.log("data" + matchId);

      const data = await response.json();
      if (response.ok) {
        showToast("success", "Action recorded successfully");
        setSelectedAction(""); // Reset action after success
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
        `${config.baseUrl}/matchscore/footballMatches/status/${matchId}?status=completed`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        navigate("/admin/matchScoreMaintain", { replace: true });
        clearInterval(intervalId);
        showToast("success", "Match completed successfully");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-darkbc flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-darkbc text-white flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="bg-darkbc text-white flex justify-center">
      <div className="min-h-screen xl:w-[70%] bg-darkbc text-white p-6">
        {/* Complete Match Button */}
        <div className="mb-6">
          <button
            onClick={handleCompleteMatch}
            disabled={completing}
            className="w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {completing ? (
              <div className="flex flex-col items-center justify-center">
                <Loading />
                <span className="ml-2">Completing Match...</span>
              </div>
            ) : (
              "Complete Match"
            )}
          </button>
        </div>

        {/* Match Details Header */}
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
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <h3 className="font-bold text-xl mb-2">
                {matchDetails?.team1Name}
              </h3>
              <p className="text-4xl font-bold">
                {matchDetails?.score?.team1 || 0}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <h3 className="font-bold text-xl mb-2">
                {matchDetails?.team2Name}
              </h3>
              <p className="text-4xl font-bold">
                {matchDetails?.score?.team2 || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Player Selection */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 mb-6 shadow-xl border border-gray-700">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Player
              </label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="">Select Player</option>
                {playerStats.map((playerStat) => (
                  <option key={playerStat._id} value={playerStat.player}>
                    {`${playerStat.playerName} (Goals: ${playerStat.goals}, Assists: ${playerStat.assists}, YC: ${playerStat.yellowcards}, RC: ${playerStat.redcards})`}
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
                  <option value="goal">
                    Score Goal (+1 goal, +1 team score)
                  </option>
                  <option value="assist">Record Assist (+1 assist)</option>
                  <option value="yellowCard">Yellow Card (+1 YC)</option>
                  <option value="redCard">Red Card (+1 RC)</option>
                  <option value="save">Save (+1 save)</option>
                  <option value="shot">Shot (+1 shot)</option>
                  <option value="tackle">Tackle (+1 tackle)</option>
                </select>

                <button
                  onClick={handleScoreUpdate}
                  disabled={!selectedAction || updatingScore}
                  className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                  {updatingScore ? (
                    <div className="flex items-center justify-center">
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

export default FootballEdit;
