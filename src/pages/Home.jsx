import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Loading from "../components/Ui/LoadingSpinner";
import { showToast } from "../components/Ui/Toastify";
import config from "../../config";

function Home() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchHomeData();
  }, []);
  useEffect(() => {
      document.title = "LFC || Home";
    }, []);

  const fetchHomeData = async () => {
    try {
      const response = await fetch(`${config.baseUrl}/main/home`);
      const data = await response.json();

      if (response.ok) {
        setHomeData(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showToast("error", "Failed to load home data");
    } finally {
      setLoading(false);
    }
  };

  if (!homeData && !loading) return null;

  return (
    <div className="flex flex-col min-h-screen bg-darkbc">
      <Navbar />
      {loading ? (
        <main className="flex-1 flex items-center justify-center">
          <Loading />
        </main>
      ) : (
        <main className="flex-1 pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center mb-24 space-y-6">
              {" "}
              {/* Added space between elements */}
              <h1
                className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-400 to-yellow-300 
              bg-clip-text text-transparent tracking-tight leading-tight px-4"
              >
                Live College Sports Tracker
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg px-4">
                Your comprehensive platform for tracking and managing college
                sports tournaments. Stay updated with live scores, player
                statistics, and tournament details all in one place.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
              <div className="p-8 bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {homeData.tournaments.total}
                </div>
                <div className="text-gray-300">Active Tournaments</div>
              </div>
              <div className="p-8 bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  {homeData.topPlayers.length}+
                </div>
                <div className="text-gray-300">Players</div>
              </div>
              <div className="p-8 bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {Object.values(homeData.sportPresent).filter(Boolean).length}
                </div>
                <div className="text-gray-300">Sports</div>
              </div>
            </div>

            {/* Upcoming Matches */}
            <section className="mb-20">
              <h2 className="text-3xl font-bold text-white text-center mb-10">
                Upcoming Matches
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {homeData.upcomingMatches.length > 0 ? (
                  homeData.upcomingMatches.map((match) => (
                    <div
                      key={match._id}
                      className="bg-gray-800/50 rounded-xl p-8 shadow-lg backdrop-blur-sm
                    hover:bg-gray-700/60 transition-all duration-300"
                    >
                      <div className="flex sm:flex-row flex-col justify-between items-center mb-4">
                        <span className="text-blue-400 font-semibold text-lg">
                          {match.sport}
                        </span>
                        <span className="text-gray-400">
                          {new Date(match.date).toLocaleString()}
                        </span>
                      </div>
                      <div className="sm:text-2xl text-xl font-bold text-white mb-3 sm:text-start text-center">
                        {match.team1Name} vs {match.team2Name}
                      </div>
                      <div className="text-gray-400 flex items-center sm:justify-start justify-center">
                        <span className="mr-2">📍</span> {match.venue}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center p-8 bg-gray-800/50 rounded-xl">
                    <p className="text-xl text-gray-400">
                      No Upcoming Match available
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Featured Players */}
            <section className="mb-20">
              <h2 className="text-3xl font-bold text-white text-center mb-10">
                Featured Players
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {homeData.topPlayers.length > 0 ? (
                  homeData.topPlayers.map((player) => (
                    <div
                      key={player._id}
                      className="bg-gray-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm
                      hover:bg-gray-700/60 transition-all duration-300"
                    >
                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                          <img
                            src={player.photo}
                            alt={player.name}
                            className="w-24 h-24 rounded-full object-cover border-2 border-blue-400"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/96?text=Player";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex sm:flex-row flex-col justify-between items-start gap-1.5">
                            <h3 className="text-2xl font-bold text-white">
                              {player.name}
                            </h3>
                            <span className="text-gray-400">
                              {player.age} years
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 sm:mt-4 mt-3 sm:mb-3">
                            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                              {player.sport}
                            </span>
                            {player.category && (
                              <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                                {player.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center p-8 bg-gray-800/50 rounded-xl">
                    <p className="text-xl text-gray-400">
                      No featured players available
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}

export default Home;
