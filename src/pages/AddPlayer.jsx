import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { showToast } from "../components/Ui/Toastify";
import config from "../../config";
function AddPlayer() {
  const [player, setPlayer] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    phone: "",
    email: "",
    rollNo: "",
    age: "",
    birthDate: "",
    collegeYear: "",
    sport: "Football",
    category: "",
    photo: null,
  });

  const [loading, setLoading] = useState(false);
  const sportsCategories = {
    Football: ["Forward", "Midfielder", "Defender", "Goalkeeper"],
    Cricket: ["Batsman", "Bowler", "All-rounder", "Wicketkeeper"],
    Badminton: ["Singles", "Doubles", "Mixed Doubles"],
  };

  const handleChange = (e) => {
    setPlayer({ ...player, [e.target.name]: e.target.value });
  };

  const handleSportChange = (e) => {
    setPlayer({ ...player, sport: e.target.value, category: "" });
  };

  const handleFileChange = (e) => {
    setPlayer({ ...player, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(player).forEach((key) => {
      formData.append(key, player[key]);
    });

    try {
      const response = await fetch(`${config.baseUrl}/admin/addplayer`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        showToast("Player added", "Success");
      } else {
        const data = await response.json();

        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Something is missing", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkbc text-white p-6 md:p-10 flex flex-col items-center">
      <ToastContainer />
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Add Player
      </h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full"
          onChange={handleChange}
        />
        <input
          type="text"
          name="fatherName"
          placeholder="Father's Name"
          className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full"
          onChange={handleChange}
        />
        <input
          type="text"
          name="motherName"
          placeholder="Mother's Name"
          className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full"
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full"
          onChange={handleChange}
        />
        <input
          type="text"
          name="rollNo"
          placeholder="Roll No"
          className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full"
          onChange={handleChange}
        />
        <input
          type="date"
          name="birthDate"
          placeholder="Birth Date"
          className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full"
          onChange={handleChange}
        />
        <select
          name="sport"
          className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full"
          onChange={handleSportChange}
        >
          <option>Football</option>
          <option>Cricket</option>
          <option>Badminton</option>
        </select>
        <select
          name="category"
          className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full"
          onChange={handleChange}
          value={player.category}
        >
          <option value="">Select Category</option>
          {sportsCategories[player.sport]?.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="file"
          name="photo"
          className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full"
          onChange={handleFileChange}
        />
        <input
          type="Number"
          name="age"
          value={player.age}
          placeholder="Age"
          className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full"
          onChange={handleChange}
        />
        <div className="col-span-1 sm:col-span-2 flex justify-center">
          <button
            type="submit"
            className="bg-miniaccent p-3 rounded-lg hover:bg-energy w-full max-w-xs"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Player"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPlayer;
