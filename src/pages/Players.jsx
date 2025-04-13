import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import { showToast } from "../components/Ui/Toastify";
import ErrorHandler from "../components/Ui/StatusCodeError";
import { useNavigate } from "react-router-dom";
import config from "../../config";
function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
        document.title = "LFC || Players";
      }, []);
  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/admin/allplayers`);
        const data = await response.json();
        if (response.status === 200) {
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
            setError({ statusCode: 404, message: "Failed to fetch" });
            return null;
          }
        }
      } catch (error) {
        setError({ statusCode: 500, message: "Resource not found" });
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const handleTeamClick = (teamName) => {
    navigate(`/players/${teamName}`);
  };

  if (error) {
    return (
      <ErrorHandler statusCode={error.statusCode} message={error.message} />
    );
  }

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center w-full py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="relative">
      <Navbar />
      <main className="bg-darkbc min-h-screen relatives">
        <div className="flex flex-col flex-grow min-h-screen justify-start items-center  text-white p-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-red-400 to-yellow-300 
              bg-clip-text text-transparent tracking-tight leading-tight px-4 text-center mt-10">Players</h1>
          <p className="text-gray-400 text-center">
            Browse all registered players.
          </p>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="mt-10 w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6">
              {players.length > 0 ? (
                players.map((player) => (
                  <Card
                    key={player._id}
                    onClick={() => handleTeamClick(player._id)}
                    image={
                      !player.photo
                        ? "https://img.freepik.com/free-vector/young-prince-royal-attire_1308-176144.jpg?ga=GA1.1.482852627.1738911374&semt=ais_hybrid"
                        : player.photo
                    }
                    name={player.name}
                    category={player.category || player.sport}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 py-10">
                  No players found
                </div>
              )}
            </div>
          )}
          <ToastContainer />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Players;
