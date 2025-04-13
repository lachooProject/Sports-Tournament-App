import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { showToast } from "../components/Ui/Toastify";
import ErrorHandler from "../components/Ui/StatusCodeError";
import config from "../../config";

const AddMatch = () => {
  const [formData, setFormData] = useState({
    sport: "Football",
    team1: "",
    team2: "",
    date: "",
    venue: "",
    status: "upcoming",
  });

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [LoadingMesage, setLoadingMessage] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!formData.sport) return;
      try {
        setLoadingMessage("Fetching Teams...");
        setLoading(true);

        const response = await fetch(
          `${config.baseUrl}/admin/allteams?sports=${formData.sport}`
        );

        if (response.status === 200) {
          const teamsData = await response.json();
          setTeams(teamsData.data.teams);
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
    fetchTeams();
  }, [formData.sport]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.sport ||
      !formData.team1 ||
      !formData.team2 ||
      !formData.date ||
      !formData.venue
    ) {
      showToast("Fill all the required field", "error");
      return;
    }

    let api = "";
    if (formData.sport === "Cricket") {
      api = `${config.baseUrl}/matchScore/cricketMatches`;
    } else if (formData.sport === "Football") {
      api = `${config.baseUrl}/matchScore/footballMatches`;
    } else if (formData.sport === "Badminton") {
      api = `${config.baseUrl}/matchScore/badmintonMatches`;
    }

    try {
      setLoadingMessage("Adding Match...");
      setLoading(true);
      const response = await fetch(`${api}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.status === 201) {
        showToast("Match Added", "success");
      } else {
        let data = await response.json();
        if (response.status === 400) {
          setError({
            statusCode: 400,
            message: data.message || "Bad request",
          });
          return null;
        }
        if (response.status === 404) {
          setError({ statusCode: 404, message: data.message });
          return null;
        }
      }
      setFormData({
        sport: "Football",
        team1: "",
        team2: "",
        date: "",
        venue: "",
      });
    } catch (error) {
      showToast("Failed to create team", "error");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <ErrorHandler statusCode={error.statusCode} message={error.message} />
    );
  }

  return (
    <div className="min-h-screen bg-darkbc text-white p-6">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Add New Match</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-gray-800 p-6 rounded-lg shadow-xl"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sport Type *
            </label>
            <select
              value={formData.sport}
              onChange={(e) =>
                setFormData({ ...formData, sport: e.target.value })
              }
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Cricket">Cricket</option>
              <option value="Football">Football</option>
              <option value="Badminton">Badminton</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Team 1 *
              </label>
              <select
                value={formData.team1}
                onChange={(e) =>
                  setFormData({ ...formData, team1: e.target.value })
                }
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!formData.sport || loading}
              >
                <option value="">Select Team 1</option>
                {teams.map((team, index) => (
                  <option key={team._id || index} value={team.teamId}>
                    {team.teamName || team.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Team 2 *
              </label>
              <select
                value={formData.team2}
                onChange={(e) =>
                  setFormData({ ...formData, team2: e.target.value })
                }
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!formData.sport || loading}
              >
                <option value="">Select Team 2</option>
                {teams.map((team, index) => (
                  <option key={team._id || index} value={team.teamId}>
                    {team.teamName || team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date and Time *
              </label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Venue *
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) =>
                  setFormData({ ...formData, venue: e.target.value })
                }
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter match venue"
                required
              />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-1/2 p-4 rounded-lg text-white font-medium transition-colors duration-200 ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-miniaccent hover:bg-energy focus:ring-2 focus:ring-energy focus:ring-offset-2 focus:ring-offset-gray-900"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {LoadingMesage}
                </span>
              ) : (
                "Add Match"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMatch;
