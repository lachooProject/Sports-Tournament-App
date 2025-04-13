import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Ui/LoadingSpinner";
import { showToast } from "../components/Ui/Toastify";
import { format } from "date-fns";
import config from "../../config";
function Matches() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("live");
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);


  useEffect(() => {
    document.title = "LFC || Matches";
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${config.baseUrl}/main/allmatch`);
      const data = await response.json();
      if (response.ok) {
        setMatches(data.data.matches);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderScore = (match, sport) => {
    switch (sport) {
      case "cricket":
        return (
          <div className="text-xl font-bold">
            {match.score.team1.score}/{match.score.team1.wickets} vs{" "}
            {match.score.team2.score}/{match.score.team2.wickets}
          </div>
        );
      case "football":
        return (
          <div className="text-xl font-bold">
            {match.score.team1} - {match.score.team2}
          </div>
        );
      case "badminton":
        return (
          <div className="text-xl font-bold">
            {match.score.player1} - {match.score.player2}
          </div>
        );
      default:
        return null;
    }
  };

  const handleMatchClick = (match, sport) => {
    console.log(match.status);
    console.log(match);
    if (match.status === "upcoming") return null;

    switch (sport.toLowerCase()) {
      case "cricket":
        navigate(`/match/cricketscore/${match._id}`);
        break;
      case "football":
        navigate(`/match/footballscore/${match._id}`);
        break;
      case "badminton":
        navigate(`/match/batmintonscore/${match._id}`);
        break;
      default:
        break;
    }
  };

  const MatchCard = ({ match, sport }) => (
    <div
      className={`bg-midnight  sm:p-6 p-3 rounded-lg shadow-lg mb-4 ${
        match.status !== "upcoming"
          ? "hover:bg-gray-700 transition-colors cursor-pointer"
          : ""
      }`}
      onClick={() => handleMatchClick(match, sport)}
    >
      <div className="flex items-center sm:flex-row flex-col justify-between mb-4">
        <div className="flex gap-2">
          <span className="text-sm bg-glowaccent px-3 py-1 rounded-full">
            {sport.toUpperCase()}
          </span>
          <span
            className={`text-sm px-3 py-1 rounded-full ${
              match.status === "live"
                ? "bg-green-600"
                : match.status === "completed"
                ? "bg-gray-600"
                : "bg-yellow-600"
            }`}
          >
            {match.status}
          </span>
        </div>
        <span className="text-gray-400">
          {format(new Date(match.date), "MMM dd, yyyy - HH:mm")}
        </span>
      </div>

      <div className="flex sm:flex-row flex-col items-center justify-between mb-4 ">
        <div className="flex items-center space-x-4 flex-1 justify-start">
          <img
            src={match.team1.photo}
            alt={match.team1.name}
            className="w-12 h-12 rounded-full object-cover hidden sm:block"
          />
          <span className="font-semibold">{match.team1.name}</span>
        </div>
        <div className="text-gray-400">VS</div>
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <span className="font-semibold">{match.team2.name}</span>
          <img
            src={match.team2.photo}
            alt={match.team2.name}
            className="w-12 h-12 rounded-full object-cover hidden sm:block"
          />
        </div>
      </div>

      <div className="text-center mb-4">{renderScore(match, sport)}</div>

      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>Venue: {match.venue}</span>
      </div>
    </div>
  );

  const NoMatchesMessage = () => (
    <div className="w-full flex flex-col items-center justify-center p-8 bg-midnight rounded-xl backdrop-blur-sm">
      <div className="text-6xl mb-4">🏆</div>
      <h3 className="text-2xl font-bold text-white mb-2">
        No {activeTab} Matches
      </h3>
      <p className="text-gray-400 text-center">
        {activeTab === "upcoming"
          ? "Stay tuned! New matches will be announced soon."
          : activeTab === "live"
          ? "There are no live matches at the moment."
          : "No completed matches found in this category."}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkbc text-white flex flex-col items-center p-6">
      <h1
        className="text-7xl bg-gradient-to-r from-red-400 to-yellow-300 
              bg-clip-text text-transparent tracking-tight leading-tight font-bold"
      >
        Matches
      </h1>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mt-8 mb-6 sm:flex-row flex-col sm:gap-1 sm:justify-center gap-1.5">
        {["live", "upcoming", "completed"].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-full capitalize ${
              activeTab === tab
                ? "bg-miniaccent text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Matches Container */}
      <div className="w-full max-w-4xl">
        {["cricket", "football", "badminton"].map((sport) => {
          const sportMatches = matches[sport][activeTab];
          return sportMatches?.length > 0 ? (
            <div key={sport} className="mb-8">
              {sportMatches.map((match) => (
                <MatchCard key={match._id} match={match} sport={sport} />
              ))}
            </div>
          ) : null;
        })}

        {/* Updated No Matches Message */}
        {["cricket", "football", "badminton"].every(
          (sport) => matches[sport][activeTab]?.length === 0
        ) && <NoMatchesMessage />}
      </div>
    </div>
  );
}

export default Matches;
