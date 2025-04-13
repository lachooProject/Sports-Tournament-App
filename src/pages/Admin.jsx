import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import config from "../../config";
import {
  FaFutbol,
  FaUsers,
  FaUserPlus,
  FaClipboardList,
  FaTableTennis,
} from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdScoreboard, MdSportsCricket } from "react-icons/md";

function Admin() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    matches: {
      total: 0,
      active: 0,
      sportWise: {
        cricket: 0,
        football: 0,
        badminton: 0,
      },
      activeByType: {
        cricket: 0,
        football: 0,
        badminton: 0,
      },
    },
    users: { total: 0 },
    teams: { total: 0 },
  });

  useEffect(() => {
    document.title = "LFC Admin Dashboard";
  }, []);

  // Add useEffect to fetch stats
  useEffect(() => {
    // Replace with your actual API endpoint
    const fetchStats = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/main/admin`);
        const data = await response.json();
        if (response.ok) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  const navLinks = [
    {
      category: "Team & Player Management",
      links: [
        { to: "/admin/teams", icon: <FaUsers />, text: "Manage Teams" },
        { to: "/admin/add-player", icon: <FaUserPlus />, text: "Add Player" },
        { to: "/admin/addmatch", icon: <IoMdAdd />, text: "Add Match" },

        {
          to: "/admin/matchScoreMaintain",
          icon: <FaClipboardList />,
          text: "Score Management",
        },
      ],
    },
  ];

  // Update the Stats Grid section
  const StatsSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Matches Card */}
        <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-400 text-sm">Total Matches</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.matches.total}
              </h3>
            </div>
            <span className="text-3xl text-blue-400">
              <MdSportsCricket />
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-700">
            <div className="text-center">
              <p className="text-xs text-gray-400">Cricket</p>
              <p className="text-sm font-bold text-blue-400">
                {stats.matches.sportWise.cricket}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Football</p>
              <p className="text-sm font-bold text-green-400">
                {stats.matches.sportWise.football}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Badminton</p>
              <p className="text-sm font-bold text-purple-400">
                {stats.matches.sportWise.badminton}
              </p>
            </div>
          </div>
        </div>

        {/* Active Matches Card */}
        <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-400 text-sm">Active Matches</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.matches.active}
              </h3>
            </div>
            <span className="text-3xl text-yellow-400">
              <MdScoreboard />
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-700">
            <div className="text-center">
              <p className="text-xs text-gray-400">Cricket</p>
              <p className="text-sm font-bold text-blue-400">
                {stats.matches.activeByType.cricket}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Football</p>
              <p className="text-sm font-bold text-green-400">
                {stats.matches.activeByType.football}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Badminton</p>
              <p className="text-sm font-bold text-purple-400">
                {stats.matches.activeByType.badminton}
              </p>
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.users.total}
              </h3>
            </div>
            <span className="text-3xl text-purple-400">
              <FaUsers />
            </span>
          </div>
        </div>

        {/* Teams Card */}
        <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Teams</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.teams.total}
              </h3>
            </div>
            <span className="text-3xl text-green-400">
              <FaUsers />
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-darkbc text-white">
      {/* Header - Updated for better mobile view */}
      <div className="bg-primary3 sticky top-0 z-50 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
          <button
            className="lg:hidden text-2xl p-2 hover:bg-gray-800 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <IoClose /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Navigation - Updated for mobile */}
      <nav
        className={`
          lg:block
          ${isMobileMenuOpen ? "block" : "hidden"}
          fixed lg:relative
          inset-x-0
          top-[73px]
          lg:top-0
          h-[calc(100vh-73px)]
          lg:h-auto
          overflow-y-auto
          bg-gray-800/95 lg:bg-gray-800/50
          backdrop-blur-sm
          lg:p-6 p-4
          lg:mt-4 lg:mx-4
          z-40
          lg:rounded-xl
          shadow-lg
          transition-all duration-300
        `}
      >
        <div className="max-w-7xl mx-auto">
          {navLinks.map((category, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-400 border-b border-gray-700 pb-2">
                {category.category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 sm:p-4 rounded-lg
                      bg-gray-700/50 hover:bg-gray-600/50
                      active:bg-gray-500/50
                      transition-all duration-300
                      hover:translate-x-1"
                  >
                    <span className="text-lg sm:text-xl text-yellow-400">
                      {link.icon}
                    </span>
                    <span className="font-medium text-sm sm:text-base">
                      {link.text}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Welcome Section - Updated for mobile */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Existing Welcome Section */}
        <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            Welcome, Admin!
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Manage all your sports activities, teams, and matches from this
            dashboard.
          </p>
        </div>

        <StatsSection />
      </div>
    </div>
  );
}

export default Admin;
