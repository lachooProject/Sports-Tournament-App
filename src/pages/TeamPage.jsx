import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { showToast } from "../components/Ui/Toastify";
import ErrorHandler from "../components/Ui/StatusCodeError";
import config from "../../config";
function TeamPage() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teamsError, setteamsError] = useState(null);
  
  const [newTeam, setNewTeam] = useState({
    name: "",
    photo: null,
    captain: "",
    sport: "Football",
    selectedPlayers: [],
  });

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${config.baseUrl}/admin/allplayers?sports=${newTeam.sport}`
        );
        const data = await response.json();
        if (response.status == 200) {
          setPlayers(data.data || []);
        } else {
          if (response.status === 400) {
            setError({
              statusCode: 400,
              message: data.message || "Bad request",
            });
            return null;
          }
          if (response.status === 404) {
            setError({ statusCode: 404, message: "Not found" });
            return null;
          }
        }
      } catch (error) {
        setError({ statusCode: 500, message: "Failed to fetch" });
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, [newTeam.sport]);

  useEffect(() => {
    setTeamsLoading(true);
    const fetchPlayers = async () => {
      setAllTeams([]);
      setteamsError(null);
      try {
        const response = await fetch(
          `${config.baseUrl}/admin/allteams?sports=${newTeam.sport}`
        );
        const data = await response.json();
        if (response.status === 200) {
          setAllTeams(data.data.teams);
        } else {
          setteamsError("Failed to Fetch");
        }
      } catch (error) {
        setteamsError("Failed to Fetch");
      } finally {
        setTeamsLoading(false);
      }
    };
    fetchPlayers();
  }, [newTeam.sport]);

  const handleChange = (e) => {
    setNewTeam({ ...newTeam, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewTeam({ ...newTeam, photo: e.target.files[0] });
  };

  const handlePlayerSelection = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setNewTeam({ ...newTeam, selectedPlayers: selectedOptions });
  };

  const addTeam = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !newTeam.name ||
      !newTeam.photo ||
      !newTeam.captain ||
      !newTeam.sport ||
      newTeam.selectedPlayers.length === 0
    ) {
      showToast("All fields are required", "error");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    // Append newTeam data to formData
    formData.append("name", newTeam.name);
    formData.append("teamPhoto", newTeam.photo);
    formData.append("captain", newTeam.captain);
    formData.append("sport", newTeam.sport);

    // Append each player ID separately to create an array in FormData
    newTeam.selectedPlayers.forEach((playerId, index) => {
      formData.append(`players[${index}]`, playerId);
    });

    try {
      const response = await fetch(`${config.baseUrl}/admin/addteam`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.status === 201) {
        showToast(data.message || "Team created successfully", "success");
        setNewTeam({
          name: "",
          photo: null,
          captain: "",
          sport: "Football",
          selectedPlayers: [],
        });
        // Refresh teams list
        setTeams([...teams, data.team]);
      } else {
        showToast(data.message || "Failed to create team", "error");
        console.log(data.message);
      }
    } catch (error) {
      showToast("Failed to create team", "error");
      console.error("Error adding team:", error);
    } finally {
      setLoading(false);
    }
  };

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-darkbc bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-white text-lg">Loading...</p>
      </div>
    </div>
  );

  const TeamsLoadingPlaceholder = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-6">
      {[1, 2].map((index) => (
        <div
          key={index}
          className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            <div className="h-6 bg-gray-700 rounded-full w-24"></div>
          </div>
          <div className="space-y-4">
            <div className="mt-4">
              <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex justify-between items-center bg-gray-700 p-2 rounded-lg h-10"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <ErrorHandler statusCode={error.statusCode} message={error.message} />
    );
  }

  return (
    <div className="min-h-screen bg-darkbc text-white p-6 md:p-10 flex flex-col items-center">
      {loading && <LoadingOverlay />}
      <ToastContainer />
      <nav className="flex justify-around bg-gray-800 p-4 mb-6 rounded-lg shadow-lg w-full max-w-4xl">
        <Link
          to="/admin"
          className="text-white font-bold hover:text-yellow-400 transition duration-300"
        >
          Admin Dashboard
        </Link>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Create a Team
      </h1>
      <form
        onSubmit={addTeam}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl"
      >
        <input
          type="text"
          name="name"
          placeholder="Team Name"
          required
          className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full"
          onChange={handleChange}
          value={newTeam.name}
        />
        <input
          type="file"
          name="photo"
          required
          accept="image/*"
          className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full"
          onChange={handleFileChange}
        />

        <select
          name="sport"
          required
          className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full"
          onChange={handleChange}
          value={newTeam.sport}
        >
          <option value="Football">Football</option>
          <option value="Cricket">Cricket</option>
          <option value="Badminton">Badminton</option>
        </select>

        <select
          name="captain"
          required
          className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full"
          value={newTeam.captain}
          onChange={handleChange}
        >
          <option value="">Select Captain</option>
          {players
            .filter((player) => newTeam.selectedPlayers.includes(player._id))
            .map((player) => (
              <option key={player._id} value={player._id}>
                {player.name}
              </option>
            ))}
        </select>

        <select
          multiple
          required
          name="selectedPlayers"
          className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full h-40"
          onChange={handlePlayerSelection}
          value={newTeam.selectedPlayers}
        >
          {players.map((player) => (
            <option key={player._id} value={player._id}>
              {player.name}
            </option>
          ))}
        </select>

        <div className="col-span-1 sm:col-span-2 flex justify-center">
          <button
            type="submit"
            className="bg-miniaccent p-3 rounded-lg hover:bg-energy w-full max-w-xs"
          >
            Create Team
          </button>
        </div>
      </form>

      <h2 className="text-2xl font-bold mt-10">Teams</h2>
      {teamsLoading ? (
        <TeamsLoadingPlaceholder />
      ) : teamsError ? (
        <div className="text-red-400 text-center py-8">
          Error loading teams: {teamsError}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl mt-6">
          {allTeams.length > 0 ? (
            allTeams.map((team) => (
              <div
                key={team.teamId}
                className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-blue-400">
                    {team.teamName}
                  </h3>
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                    {team.players.length} Players
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2 text-gray-300">
                      Players
                    </h4>
                    <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2">
                      {team.players.map((player) => (
                        <div
                          key={player.playerId}
                          className="flex justify-between items-center bg-gray-700 p-2 rounded-lg"
                        >
                          <span className="text-white">
                            {player.playerName}
                          </span>
                          <span className="text-sm px-2 py-1 bg-blue-600/30 rounded-full">
                            {player.playerCategory}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full justify-center col-span-3 text-center text-gray-400 py-8">
              No teams found for this sport
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TeamPage;
