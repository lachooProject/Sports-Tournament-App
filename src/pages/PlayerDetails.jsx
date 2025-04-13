import React from "react";
import { useParams } from "react-router-dom";

const players = [
  {
    id: 1,
    name: "Cristiano Ronaldo",
    age: 39,
    height: `6'2"`,
    position: "Forward",
    goals: 820,
    assists: 230,
    fouls: 50,
    sport: "Football",
  },
  {
    id: 2,
    name: "LeBron James",
    age: 39,
    height: `6'9"`,
    position: "Small Forward",
    points: 39000,
    assists: 10000,
    rebounds: 10000,
    sport: "Basketball",
  },
  {
    id: 3,
    name: "Kento Momota",
    age: 30,
    height: `5'9"`,
    position: "Singles",
    wins: 250,
    losses: 60,
    smashes: 900,
    sport: "Badminton",
  },
];

function PlayerDetails() {
  const { playerName } = useParams();
  const player = players.find((p) => p.name === playerName);

  if (!player) {
    return <h2 className="text-center text-white">Player not found</h2>;
  }

  return (
    <div className="min-h-screen bg-midnight text-white flex justify-center items-center p-6">
      <div className="max-w-lg w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">{player.name}</h1>
        <p className="text-gray-400">Age: {player.age}</p>
        <p className="text-gray-400">Height: {player.height}</p>
        <p className="text-gray-400">Sport: {player.sport}</p>
        <p className="text-gray-400">Position: {player.position}</p>
        {player.sport === "Football" && (
          <>
            <p className="text-gray-400">Goals: {player.goals}</p>
            <p className="text-gray-400">Assists: {player.assists}</p>
            <p className="text-gray-400">Fouls: {player.fouls}</p>
          </>
        )}
        {player.sport === "Basketball" && (
          <>
            <p className="text-gray-400">Points: {player.points}</p>
            <p className="text-gray-400">Assists: {player.assists}</p>
            <p className="text-gray-400">Rebounds: {player.rebounds}</p>
          </>
        )}
        {player.sport === "Badminton" && (
          <>
            <p className="text-gray-400">Wins: {player.wins}</p>
            <p className="text-gray-400">Losses: {player.losses}</p>
            <p className="text-gray-400">Smashes: {player.smashes}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default PlayerDetails;
