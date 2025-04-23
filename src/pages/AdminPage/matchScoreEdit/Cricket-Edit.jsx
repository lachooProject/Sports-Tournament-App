import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ErrorHandler from "../../../components/Ui/StatusCodeError";
import Loading from "../../../components/Ui/LoadingSpinner";
import { showToast } from "../../../components/Ui/Toastify";
import config from "../../../../config";

const CricketEdit = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Only for initial page load
  const [error, setError] = useState(null);
  const [battingTeam, setBattingTeam] = useState("");
  const [bowlingTeam, setBowlingTeam] = useState("");
  const [players, setPlayers] = useState({ batting: [], bowling: [] });
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [selectedBatsman, setSelectedBatsman] = useState("");
  const [selectedBowler, setSelectedBowler] = useState("");
  const [updatingScore, setUpdatingScore] = useState(false);
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [selectedOutType, setSelectedOutType] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [completing, setCompleting] = useState(false);
  
  const outTypes = [
    "bowled",
    "caught",
    "run out",
    "lbw",
    "stumped",
    "hit wicket",
  ];

  const API_BASE_URL = `${config.baseUrl}`;
  useEffect(() => {
    // Initial fetch
    fetchMatchDetails();

    // Set up interval for auto-refresh
    const intervalId = setInterval(() => {
      fetchMatchDetails();
    }, 5000); // 5000 milliseconds = 5 seconds

    // Cleanup interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [matchId]);

  const fetchMatchDetails = async () => {
    try {
      // Only show loading on very first fetch
      if (isInitialLoad) {
        setLoading(true);
      }

      const response = await fetch(
        `${API_BASE_URL}/matchscore/cricketMatches/${matchId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        // Only show error toast on critical errors
        if (isInitialLoad) {
          showToast(
            "error",
            errorData.message || "Failed to fetch match details"
          );
        }
        throw new Error(errorData.message || "Failed to fetch match details");
      }

      const data = await response.json();
      setMatchDetails(data.data.match);

      // Only on first successful load
      if (isInitialLoad) {
        setIsInitialLoad(false);
        setLoading(false);
      }
    } catch (error) {
      if (isInitialLoad) {
        setError(error.message);
        showToast("error", "Failed to load match details");
        setLoading(false);
      }
    }
  };

  const fetchTeamPlayers = async (teamId, type) => {
    try {
      setLoadingPlayers(true);
      const response = await fetch(`${API_BASE_URL}/admin/team/${teamId}`);

      if (!response.ok) {
        const errorData = await response.json();
        showToast(
          "error",
          errorData.message || `Failed to fetch ${type} team players`
        );
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setPlayers((prev) => ({
        ...prev,
        [type]: data.data.team.players,
      }));
      showToast("success", `${type} team players loaded successfully`);
    } catch (error) {
      setError(error.message);
      showToast("error", `Failed to load ${type} team players`);
    } finally {
      setLoadingPlayers(false);
    }
  };

  const handleBattingTeamChange = async (e) => {
    const selectedTeam = e.target.value;
    setBattingTeam(selectedTeam);
    setSelectedBowler(""); // Reset selected bowler

    if (selectedTeam) {
      // Set batting team players
      const battingTeamId =
        matchDetails.team1Name === selectedTeam
          ? matchDetails.team1
          : matchDetails.team2;
      await fetchTeamPlayers(battingTeamId, "batting");

      // Automatically set bowling team and fetch its players
      const bowlingTeamId =
        matchDetails.team1Name === selectedTeam
          ? matchDetails.team2
          : matchDetails.team1;
      setBowlingTeam(bowlingTeamId);
      await fetchTeamPlayers(bowlingTeamId, "bowling");

      showToast("success", `Selected ${selectedTeam} as batting team`);
    }
  };

  const handleBatsmanChange = (e) => {
    setSelectedBatsman(e.target.value);
    showToast("success", "Selected batsman successfully");
  };

  const handleBowlerChange = (e) => {
    setSelectedBowler(e.target.value);
    showToast("success", "Selected bowler successfully");
  };

  const updateMatchScore = async (scoreData) => {
    try {
      setUpdatingScore(true);
      const response = await fetch(
        `${API_BASE_URL}/matchScore/cricketMatches/ballstats/${matchId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            batsmanId: selectedBatsman,
            bowlerId: selectedBowler,
            ...scoreData,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        showToast("error", errorData.message || "Failed to update score");
        throw new Error(errorData.message);
      }

      await fetchMatchDetails(); // Refresh match details
      showToast("success", "Score updated successfully");
    } catch (error) {
      setError(error.message);
      showToast("error", "Failed to update score");
    } finally {
      setUpdatingScore(false);
    }
  };

  const handleScoreUpdate = async (runs) => {
    await updateMatchScore({ runs });
  };

  const handleWide = async () => {
    await updateMatchScore({ whitballthrough: true });
  };

  const handleFour = async () => {
    await updateMatchScore({ fours: true });
  };

  const handleSix = async () => {
    await updateMatchScore({ sixes: true });
  };

  const handleWicket = async (outType) => {
    if (!outType) {
      setShowWicketModal(true);
      return;
    }

    try {
      setUpdatingScore(true);
      await updateMatchScore({
        wicket: true,
        outType: outType,
      });
      showToast("success", `Wicket! Out by ${outType}`);
      setShowWicketModal(false);
      setSelectedOutType("");
    } catch (error) {
      showToast("error", "Failed to record wicket");
    } finally {
      setUpdatingScore(false);
    }
  };

  const handleCompleteMatch = async () => {
    setCompleting(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/matchscore/cricketMatches/status/${matchId}?status=completed`,
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
        navigate("/admin/matchScoreMaintain", { replace: true });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setCompleting(false);
    }
  };

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  if (isInitialLoad && loading) {
    return (
      <main className="bg-darkbc flex justify-center items-center min-h-screen">
        <Loading />
      </main>
    );
  }
  if (error) return <ErrorHandler message={error} />;

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
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 mb-6 shadow-xl border border-gray-700">
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-8">
            <div className="text-center p-4 bg-gray-800 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-bold text-xl mb-2 text-blue-400">
                {matchDetails?.team1Name}
              </h3>
              <p className="text-4xl font-bold text-white">
                {matchDetails?.score?.team1?.score}/
                {matchDetails?.score?.team1?.wickets}
              </p>
              <p className="text-gray-400 mt-2">
                ({Math.floor(matchDetails?.score?.team1?.teamballs / 6)}.
                {matchDetails?.score?.team1?.teamballs % 6} overs)
              </p>
            </div>

            <div className="text-center p-4 bg-gray-800 rounded-lg border-r-4 border-blue-500">
              <h3 className="font-bold text-xl mb-2 text-blue-400">
                {matchDetails?.team2Name}
              </h3>
              <p className="text-4xl font-bold text-white">
                {matchDetails?.score?.team2?.score}/
                {matchDetails?.score?.team2?.wickets}
              </p>
              <p className="text-gray-400 mt-2">
                ({Math.floor(matchDetails?.score?.team2?.teamballs / 6)}.
                {matchDetails?.score?.team2?.teamballs % 6} overs)
              </p>
            </div>
          </div>
        </div>

        {/* Team Selection Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 mb-6 shadow-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-blue-400">
            Team Selection
          </h2>

          {/* Batting Team Selection */}
          <div className="mb-6">
            <label
              htmlFor="battingTeam"
              className="block text-lg font-medium text-gray-200 mb-2"
            >
              Select Batting Team
            </label>
            <select
              id="battingTeam"
              value={battingTeam}
              onChange={handleBattingTeamChange}
              className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
            >
              <option value="">Select Batting Team</option>
              {matchDetails?.team1Name && (
                <option value={matchDetails.team1Name}>
                  {matchDetails.team1Name}
                </option>
              )}
              {matchDetails?.team2Name && (
                <option value={matchDetails.team2Name}>
                  {matchDetails.team2Name}
                </option>
              )}
            </select>

            {/* Only show player selections if a valid batting team is selected */}
            {battingTeam && battingTeam !== "" && (
              <div className="mt-4 grid sm:grid-cols-2 grid-cols-1 gap-4">
                {players.batting.length > 0 && (
                  <div className="w-full">
                    <label
                      htmlFor="battingPlayer"
                      className="block text-lg font-medium text-gray-200 mb-2"
                    >
                      Select Batsman
                    </label>
                    <select
                      id="battingPlayer"
                      value={selectedBatsman}
                      onChange={handleBatsmanChange}
                      className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                    >
                      <option value="">Select Player</option>
                      {players.batting.map((player) => {
                        const playerStat = matchDetails.playersStats.find(
                          (stat) => stat.playerId === player._id
                        );

                        const isOut = playerStat?.isOut === true;

                        return (
                          <option
                            key={player._id}
                            value={player._id}
                            disabled={isOut} // This disables the option if player is out
                          >
                            {player.name} ({player.category})
                            {playerStat ? ` - Runs: ${playerStat.runs}` : ""}
                            {isOut ? " (Out)" : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
                {players.bowling.length > 0 && (
                  <div className="w-full">
                    <label
                      htmlFor="bowlingPlayer"
                      className="block text-lg font-medium text-gray-200 mb-2"
                    >
                      Select Bowler (
                      {matchDetails?.team1Name === battingTeam
                        ? matchDetails?.team2Name
                        : matchDetails?.team1Name}
                      )
                    </label>
                    <select
                      id="bowlingPlayer"
                      value={selectedBowler}
                      onChange={handleBowlerChange}
                      className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                    >
                      <option value="">Select Player</option>
                      {players.bowling.map((player) => (
                        <option key={player._id} value={player._id}>
                          {player.name}({player.category})-
                          {matchDetails.playersStats.map((playerStat) => {
                            if (playerStat.playerId === player._id) {
                              return `Overs: ${Math.floor(
                                playerStat.ballsBowled / 6
                              )}.${playerStat.ballsBowled % 6}`;
                            }
                            return null;
                          })}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Loading indicator for players */}
          {loadingPlayers && <Loading />}
        </div>

        {/* Scoring Buttons Section */}
        {selectedBatsman && selectedBowler && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-blue-400 mb-4">
              Scoring Options
            </h3>

            {/* Run Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
              {updatingScore ? (
                <div className="flex justify-center items-center col-span-3 sm:col-span-6">
                  <Loading />
                </div>
              ) : (
                <>
                   <button
                    onClick={() => handleScoreUpdate(0)}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                    disabled={updatingScore}
                  >
                    0 Run
                  </button>
                  <button
                    onClick={() => handleScoreUpdate(1)}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                    disabled={updatingScore}
                  >
                    1 Run
                  </button>
                  <button
                    onClick={() => handleScoreUpdate(2)}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                    disabled={updatingScore}
                  >
                    2 Runs
                  </button>
                  <button
                    onClick={() => handleScoreUpdate(3)}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                    disabled={updatingScore}
                  >
                    3 Runs
                  </button>
                  <button
                    onClick={() => handleFour()}
                    className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                    disabled={updatingScore}
                  >
                    FOUR
                  </button>
                  <button
                    onClick={() => handleSix()}
                    className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors"
                    disabled={updatingScore}
                  >
                    SIX
                  </button>
                  <button
                    onClick={() => handleWide()}
                    className="p-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-bold transition-colors"
                    disabled={updatingScore}
                  >
                    Wide
                  </button>
                </>
              )}
            </div>

            {/* Wicket Button and Modal */}
            <div className="mt-4">
              <button
                onClick={() => setShowWicketModal(true)}
                className="w-full p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
                disabled={updatingScore}
              >
                WICKET
              </button>

              {/* Wicket Type Modal */}
              {showWicketModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                    <h4 className="text-xl font-bold text-white mb-4">
                      Select Out Type
                    </h4>
                    <select
                      value={selectedOutType}
                      onChange={(e) => setSelectedOutType(e.target.value)}
                      className="w-full p-3 mb-4 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                    >
                      <option value="">Select Out Type</option>
                      {outTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setShowWicketModal(false);
                          setSelectedOutType("");
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleWicket(selectedOutType)}
                        disabled={!selectedOutType || updatingScore}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CricketEdit;
