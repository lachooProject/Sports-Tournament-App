import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CricketMatches() {
  const [matches, setMatches] = useState({ live: [], upcoming: [], past: [] });
  const [activeTab, setActiveTab] = useState("live");

  useEffect(() => {
    // Dummy Data for Cricket Matches
    setMatches({
      live: [
        { id: 1, teams: "India vs Australia", score: "250/3 (40.2 ov)", status: "Live" },
        { id: 2, teams: "England vs South Africa", score: "189/5 (30.4 ov)", status: "Live" }
      ],
      upcoming: [
        { id: 3, teams: "Pakistan vs New Zealand", date: "March 5, 2025", time: "10:00 AM GMT" },
        { id: 4, teams: "Sri Lanka vs Bangladesh", date: "March 6, 2025", time: "2:00 PM GMT" }
      ],
      past: [
        { id: 5, teams: "West Indies vs Afghanistan", score: "West Indies won by 5 wickets" },
        { id: 6, teams: "India vs England", score: "India won by 30 runs" }
      ]
    });
  }, []);

  return (
    <div className="min-h-screen bg-midnight text-ice-blue p-10">
      <nav className="flex justify-around bg-gray-800 p-4 mb-6 rounded-lg shadow-lg">
        <Link 
          to="/admin/cricket-matches" 
          className={`text-ice-blue font-bold transition duration-300 ${
            window.location.pathname === '/admin/cricket-matches' 
              ? 'text-blue-500' 
              : 'hover:text-yellow-400'
          }`}
        >
          Cricket
        </Link>
        <Link 
          to="/admin/football-matches" 
          className={`text-ice-blue font-bold transition duration-300 ${
            window.location.pathname === '/admin/football-matches' 
              ? 'text-blue-500' 
              : 'hover:text-yellow-400'
          }`}
        >
          Football
        </Link>
        <Link 
          to="/admin/badminton-matches" 
          className={`text-ice-blue font-bold transition duration-300 ${
            window.location.pathname === '/admin/badminton-matches' 
              ? 'text-blue-500' 
              : 'hover:text-yellow-400'
          }`}
        >
          Badminton
        </Link>
      </nav>
      
      <h1 className="text-4xl font-bold text-center mb-10">Cricket Matches</h1>
      
      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mb-6">
        <button onClick={() => setActiveTab("live")} className={`p-2 px-4 rounded-lg transition duration-300 ${activeTab === "live" ? "bg-blue-500 text-white shadow-lg" : "bg-gray-700 hover:bg-gray-600"}`}>Live</button>
        <button onClick={() => setActiveTab("upcoming")} className={`p-2 px-4 rounded-lg transition duration-300 ${activeTab === "upcoming" ? "bg-blue-500 text-white shadow-lg" : "bg-gray-700 hover:bg-gray-600"}`}>Upcoming</button>
        <button onClick={() => setActiveTab("past")} className={`p-2 px-4 rounded-lg transition duration-300 ${activeTab === "past" ? "bg-blue-500 text-white shadow-lg" : "bg-gray-700 hover:bg-gray-600"}`}>Past</button>
      </div>
      
      {/* Matches Display */}
      {activeTab === "live" && (
        <div>
          <h2 className="text-3xl font-bold mb-4">Live Matches</h2>
          <ul className="mb-6">
            {matches.live.map(match => (
              <li key={match.id} className="p-4 bg-blue-900 mb-2 rounded-lg shadow-md text-lg font-semibold">{match.teams} - {match.score}</li>
            ))}
          </ul>
        </div>
      )}
      {activeTab === "upcoming" && (
        <div>
          <h2 className="text-3xl font-bold mb-4">Upcoming Matches</h2>
          <ul className="mb-6">
            {matches.upcoming.map(match => (
              <li key={match.id} className="p-4 bg-blue-800 mb-2 rounded-lg shadow-md text-lg font-semibold">{match.teams} - {match.date} at {match.time}</li>
            ))}
          </ul>
        </div>
      )}
      {activeTab === "past" && (
        <div>
          <h2 className="text-3xl font-bold mb-4">Past Matches</h2>
          <ul>
            {matches.past.map(match => (
              <li key={match.id} className="p-4 bg-gray-800 mb-2 rounded-lg shadow-md text-lg font-semibold">{match.teams} - {match.score}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CricketMatches;