import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function FootballMatches() {
  const location = useLocation();
  const [matches, setMatches] = useState({ live: [], upcoming: [], past: [] });
  const [activeTab, setActiveTab] = useState("live");

  useEffect(() => {
    // Dummy Data for Football Matches
    setMatches({
      live: [
        { id: 1, teams: "Manchester United vs Liverpool", score: "2-1", time: "75'", status: "Live" },
        { id: 2, teams: "Barcelona vs Real Madrid", score: "0-0", time: "32'", status: "Live" }
      ],
      upcoming: [
        { id: 3, teams: "Bayern Munich vs Dortmund", date: "March 5, 2025", time: "8:00 PM CET" },
        { id: 4, teams: "PSG vs Manchester City", date: "March 6, 2025", time: "9:00 PM CET" }
      ],
      past: [
        { id: 5, teams: "Arsenal vs Chelsea", score: "Arsenal won 3-1" },
        { id: 6, teams: "Juventus vs Inter Milan", score: "Draw 2-2" }
      ]
    });
  }, []);

  return (
    <div className="min-h-screen bg-midnight text-ice-blue p-10">
      <nav className="flex justify-around bg-gray-800 p-4 mb-6 rounded-lg shadow-lg">
        <Link 
          to="/admin/cricket-matches" 
          className={`text-ice-blue font-bold transition duration-300 ${
            location.pathname === '/admin/cricket-matches' 
              ? 'text-blue-500' 
              : 'hover:text-yellow-400'
          }`}
        >
          Cricket
        </Link>
        <Link 
          to="/admin/football-matches" 
          className={`text-ice-blue font-bold transition duration-300 ${
            location.pathname === '/admin/football-matches' 
              ? 'text-blue-500' 
              : 'hover:text-yellow-400'
          }`}
        >
          Football
        </Link>
        <Link 
          to="/admin/badminton-matches" 
          className={`text-ice-blue font-bold transition duration-300 ${
            location.pathname === '/admin/badminton-matches' 
              ? 'text-blue-500' 
              : 'hover:text-yellow-400'
          }`}
        >
          Badminton
        </Link>
      </nav>
      
      <h1 className="text-4xl font-bold text-center mb-10">Football Matches</h1>
      
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
              <li key={match.id} className="p-4 bg-blue-900 mb-2 rounded-lg shadow-md text-lg font-semibold">
                {match.teams} - {match.score} ({match.time})
              </li>
            ))}
          </ul>
        </div>
      )}
      {activeTab === "upcoming" && (
        <div>
          <h2 className="text-3xl font-bold mb-4">Upcoming Matches</h2>
          <ul className="mb-6">
            {matches.upcoming.map(match => (
              <li key={match.id} className="p-4 bg-blue-800 mb-2 rounded-lg shadow-md text-lg font-semibold">
                {match.teams} - {match.date} at {match.time}
              </li>
            ))}
          </ul>
        </div>
      )}
      {activeTab === "past" && (
        <div>
          <h2 className="text-3xl font-bold mb-4">Past Matches</h2>
          <ul>
            {matches.past.map(match => (
              <li key={match.id} className="p-4 bg-gray-800 mb-2 rounded-lg shadow-md text-lg font-semibold">
                {match.teams} - {match.score}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FootballMatches;