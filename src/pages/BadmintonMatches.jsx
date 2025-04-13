import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function BadmintonMatches() {
  const location = useLocation();
  const [matches, setMatches] = useState({ live: [], upcoming: [], past: [] });
  const [activeTab, setActiveTab] = useState("live");

  useEffect(() => {
    // Dummy Data for Badminton Matches
    setMatches({
      live: [
        { id: 1, teams: "Lin Dan vs Lee Chong Wei", score: "21-19, 15-12", status: "Live" },
        { id: 2, teams: "Viktor Axelsen vs Kento Momota", score: "18-21, 21-15, 11-8", status: "Live" }
      ],
      upcoming: [
        { id: 3, teams: "Carolina Marin vs Tai Tzu-ying", date: "March 5, 2025", time: "2:00 PM GMT" },
        { id: 4, teams: "PV Sindhu vs Nozomi Okuhara", date: "March 6, 2025", time: "4:30 PM GMT" }
      ],
      past: [
        { id: 5, teams: "Chen Long vs Anders Antonsen", score: "Chen Long won 21-18, 21-15" },
        { id: 6, teams: "Akane Yamaguchi vs He Bingjiao", score: "Yamaguchi won 21-19, 21-16" }
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
      
      <h1 className="text-4xl font-bold text-center mb-10">Badminton Matches</h1>
      
      <div className="flex justify-center space-x-4 mb-6">
        <button 
          onClick={() => setActiveTab("live")} 
          className={`p-2 px-4 rounded-lg transition duration-300 ${
            activeTab === "live" ? "bg-blue-500 text-white shadow-lg" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Live
        </button>
        <button 
          onClick={() => setActiveTab("upcoming")} 
          className={`p-2 px-4 rounded-lg transition duration-300 ${
            activeTab === "upcoming" ? "bg-blue-500 text-white shadow-lg" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setActiveTab("past")} 
          className={`p-2 px-4 rounded-lg transition duration-300 ${
            activeTab === "past" ? "bg-blue-500 text-white shadow-lg" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Past
        </button>
      </div>
      
      {activeTab === "live" && (
        <div>
          <h2 className="text-3xl font-bold mb-4">Live Matches</h2>
          <ul className="mb-6">
            {matches.live.map(match => (
              <li key={match.id} className="p-4 bg-blue-900 mb-2 rounded-lg shadow-md text-lg font-semibold">
                {match.teams} - {match.score}
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

export default BadmintonMatches;