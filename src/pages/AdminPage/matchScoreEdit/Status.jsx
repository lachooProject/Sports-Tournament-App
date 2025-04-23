import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate, replace } from "react-router-dom";
import ErrorHandler from "../../../components/Ui/StatusCodeError";
import Loading from "../../../components/Ui/LoadingSpinner";
import { showToast } from "../../../components/Ui/Toastify";
import axios from "axios";
import config from "../../../../config";

const ErrorMessage = ({ message }) => (
  <div className="min-h-screen bg-midnight text-white flex items-center justify-center">
    <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
      <p className="text-red-500">{message}</p>
    </div>
  </div>
);

// Add this helper function above the Status component
const CricketStatusForm = ({
  matchDetails,
  status,
  tossWinner,
  tossChoice,
  onStatusChange,
  onTossWinnerChange,
  onTossChoiceChange,
  isLoading,
}) => (
  <div className="space-y-6">
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Toss Winner
          </label>
          <select
            value={tossWinner}
            onChange={(e) => onTossWinnerChange(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            required
          >
            <option value="">Select Toss Winner</option>
            <option value={matchDetails.team1?._id}>
              {matchDetails.team1Name}
            </option>
            <option value={matchDetails.team2?._id}>
              {matchDetails.team2Name}
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Choose to
          </label>
          <select
            value={tossChoice}
            onChange={(e) => onTossChoiceChange(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            required
          >
            <option value="batting">Batting</option>
            <option value="bowling">Bowling</option>
          </select>
        </div>
      </div>
    </div>

    <button
      type="submit"
      className="w-full p-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 disabled:opacity-50"
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <Loading />
          <span className="ml-2">Updating...</span>
        </div>
      ) : (
        "Start Match"
      )}
    </button>
  </div>
);

const OtherSportsStatusForm = ({ sport, isLoading }) => (
  <button
    type="submit"
    className="w-full mx-auto p-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
    disabled={isLoading}
  >
    {isLoading ? (
      <div className="flex flex-col items-center justify-center">
        <Loading />
        <span className="ml-2">Updating...</span>
      </div>
    ) : (
      `Start ${sport} Match`
    )}
  </button>
);

const Status = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const matchId = params.matchId;
  const { sport } = location.state || {};

  const [status, setStatus] = useState("live");
  const [tossWinner, setTossWinner] = useState("");
  const [tossChoice, setTossChoice] = useState("batting");
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  

  useEffect(() => {
    const fetchMatchDetails = async () => {
      if (!matchId || !sport) {
        setError(
          `Missing required parameters: ${!matchId ? "matchId" : ""} ${
            !sport ? "sport" : ""
          }`.trim()
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const url = `${
          config.baseUrl
        }/matchScore/${sport.toLowerCase()}Matches/${matchId}`;
        const response = await axios.get(url);
        const { data } = response.data;

        if (!data) {
          throw new Error("No match data found");
        }

        setMatchDetails(data.match);
        setStatus(data.status || "live");
        setTossWinner(data.tossWinner || "");
        setTossChoice(data.tossChoice || "batting");
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch match details"
        );
        showToast("error", "Failed to load match details");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [matchId, sport]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdatingStatus(true);

      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append("status", status);

      if (sport.toLowerCase() === "cricket" && status === "live") {
        if (!tossWinner) {
          showToast("error", "Please select toss winner");
          return;
        }

        queryParams.append("toosewon", tossWinner);
        if (tossChoice === "batting") {
          queryParams.append("chooseBatting", "true");
          queryParams.append("chooseBowling", "false");
        } else {
          queryParams.append("chooseBatting", "false");
          queryParams.append("chooseBowling", "true");
        }
      }

      // Construct URL with query parameters
      const url = `${
        config.baseUrl
      }/matchScore/${sport.toLowerCase()}Matches/status/${matchId}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        showToast("success", "Match status updated successfully");

        if (status === "live") {
          const routes = {
            cricket: `/admin/matchscoremaintain/Cricket_Edit/${matchId}`,
            football: `/admin/matchscoremaintain/Football_Edit/${matchId}`,
            badminton: `/admin/matchscoremaintain/Badminton_Edit/${matchId}`,
          };
          navigate(routes[sport.toLowerCase()] || -1, { replace: true });
        } else {
          navigate(-1, { replace: true });
        }
      } else {
        throw new Error(data.message || "Failed to update status");
      }
    } catch (error) {
      showToast("error", error.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Modify the select options to only show relevant status changes
  const getStatusOptions = () => {
    if (matchDetails?.status === "upcoming") {
      return (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
        >
          <option value="upcoming">Upcoming</option>
          <option value="live">Live</option>
        </select>
      );
    }
    return (
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
      >
        <option value="live">Live</option>
        <option value="completed">Completed</option>
      </select>
    );
  };

  // Replace loading and error states with components
  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <ErrorHandler message={error} />;
  }

  if (!matchDetails) {
    return <ErrorHandler message="No match details found" />;
  }

  return (
    <div className="min-h-screen bg-midnight text-white p-6">
      <div className="max-w-4xl mx-auto ">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Update Match Status - {sport}
        </h1>
        <div className="mb-6 text-center">
          <p className="text-lg">
            {matchDetails?.team1Name} vs {matchDetails?.team2Name}
          </p>
          <p className="text-md text-gray-400 mt-2">
            Current Status: {matchDetails?.status}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {sport.toLowerCase() === "cricket" ? (
            <CricketStatusForm
              matchDetails={matchDetails}
              status={status}
              tossWinner={tossWinner}
              tossChoice={tossChoice}
              onStatusChange={(value) => setStatus(value)}
              onTossWinnerChange={(value) => setTossWinner(value)}
              onTossChoiceChange={(value) => setTossChoice(value)}
              isLoading={updatingStatus}
            />
          ) : (
            <OtherSportsStatusForm sport={sport} isLoading={updatingStatus} />
          )}
        </form>
      </div>
    </div>
  );
};

export default Status;
