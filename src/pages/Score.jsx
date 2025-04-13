import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useResponsive } from '../components/Responsive';

const Score = () => {
  const [selectedSport, setSelectedSport] = useState('cricket');
  const [scoreType, setScoreType] = useState('live');
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();

  const scores = {
    cricket: {
      live: [
        {
          id: 'match1',
          teams: {
            team1: { name: 'Mumbai Indians', score: '185/4 (18.2)', id: 'mumbai-indians' },
            team2: { name: 'Chennai Super Kings', score: '156/6 (16.0)', id: 'chennai-super-kings' }
          },
          status: 'Live',
          keyPlayers: [
            { name: 'Rohit Sharma', performance: '72(45)', id: 'rohit-sharma' },
            { name: 'MS Dhoni', performance: '45*(28)', id: 'ms-dhoni' }
          ]
        }
      ],
      past: [
        {
          id: 'match2',
          teams: {
            team1: { name: 'Mumbai Indians', score: '192/5', id: 'mumbai-indians' },
            team2: { name: 'Chennai Super Kings', score: '190/8', id: 'chennai-super-kings' }
          },
          result: 'Mumbai Indians won by 2 runs',
          date: '2024-03-25'
        }
      ]
    },
    football: {
      live: [
        {
          id: 'match3',
          teams: {
            team1: { name: 'Manchester United', score: '2', id: 'manchester-united' },
            team2: { name: 'Real Madrid', score: '1', id: 'real-madrid' }
          },
          status: 'Live - 75\'',
          keyPlayers: [
            { name: 'Marcus Rashford', performance: '2 Goals', id: 'marcus-rashford' }
          ]
        }
      ],
      past: [
        {
          id: 'match4',
          teams: {
            team1: { name: 'Manchester United', score: '3', id: 'manchester-united' },
            team2: { name: 'Real Madrid', score: '2', id: 'real-madrid' }
          },
          result: 'Manchester United won',
          date: '2024-03-20'
        }
      ]
    },
    badminton: {
      live: [
        {
          id: 'match5',
          players: {
            player1: { name: 'PV Sindhu', score: '21-19, 15-12', id: 'pv-sindhu' },
            player2: { name: 'Carolina Marin', score: '19-21, 12-15', id: 'carolina-marin' }
          },
          status: 'Live - Game 2',
        }
      ],
      past: [
        {
          id: 'match6',
          players: {
            player1: { name: 'Kidambi Srikanth', score: '21-18, 21-15', id: 'kidambi-srikanth' },
            player2: { name: 'Lee Zii Jia', score: '18-21, 15-21', id: 'lee-zii-jia' }
          },
          result: 'Kidambi Srikanth won',
          date: '2024-03-22'
        }
      ]
    }
  };

  const handleTeamClick = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  const handlePlayerClick = (playerId) => {
    navigate(`/players/${playerId}`);
  };

  return (
    <div className="bg-midnight min-h-screen pb-20">
      <Navbar />
      <div className={`container mx-auto px-4 py-8 ${isMobile ? 'space-y-4' : 'space-y-6'}`}>
        {/* Page Title */}
        <h1 className={`font-bold text-white text-center mb-10 
          ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
          Live Scores
        </h1>
        
        {/* Sport Selection - Centered */}
        <div className={`flex justify-center ${isMobile ? 'space-x-2' : 'space-x-6'} mb-8`}>
          {['cricket', 'football', 'badminton'].map(sport => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`${isMobile ? 'px-3 py-2 text-sm' : 'px-6 py-3 text-lg'} 
                rounded-lg font-medium transition-colors duration-200 ${
                selectedSport === sport
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {sport.charAt(0).toUpperCase() + sport.slice(1)}
            </button>
          ))}
        </div>

        {/* Score Type Selection - Centered */}
        <div className="flex justify-center space-x-6 mb-10">
          <button
            onClick={() => setScoreType('live')}
            className={`px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
              scoreType === 'live'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Live Scores
          </button>
          <button
            onClick={() => setScoreType('past')}
            className={`px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
              scoreType === 'past'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Past Scores
          </button>
        </div>

        {/* Score Cards - Max width and centered */}
        <div className={`max-w-4xl mx-auto ${isMobile ? 'space-y-4' : 'space-y-6'}`}>
          {scores[selectedSport][scoreType].map((match) => (
            <div key={match.id} className="bg-gray-800 rounded-lg p-8 shadow-xl hover:shadow-2xl transition-shadow duration-200">
              {selectedSport === 'badminton' ? (
                // Badminton Score Card
                <div className="flex justify-between items-center">
                  <div 
                    className="cursor-pointer hover:text-blue-400 transition-colors duration-200 flex-1 text-center"
                    onClick={() => handlePlayerClick(match.players.player1.id)}
                  >
                    <span className="text-2xl font-bold text-white block mb-2">
                      {match.players.player1.name}
                    </span>
                    <span className="text-xl text-gray-400">
                      {match.players.player1.score}
                    </span>
                  </div>
                  <div className="text-gray-400 text-2xl px-8">vs</div>
                  <div 
                    className="cursor-pointer hover:text-blue-400 transition-colors duration-200 flex-1 text-center"
                    onClick={() => handlePlayerClick(match.players.player2.id)}
                  >
                    <span className="text-2xl font-bold text-white block mb-2">
                      {match.players.player2.name}
                    </span>
                    <span className="text-xl text-gray-400">
                      {match.players.player2.score}
                    </span>
                  </div>
                </div>
              ) : (
                // Cricket/Football Score Card
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div 
                      className="cursor-pointer hover:text-blue-400 transition-colors duration-200 flex-1 text-center"
                      onClick={() => handleTeamClick(match.teams.team1.id)}
                    >
                      <span className="text-2xl font-bold text-white block mb-2">
                        {match.teams.team1.name}
                      </span>
                      <span className="text-xl text-gray-400">
                        {match.teams.team1.score}
                      </span>
                    </div>
                    <div className="text-gray-400 text-2xl px-8">vs</div>
                    <div 
                      className="cursor-pointer hover:text-blue-400 transition-colors duration-200 flex-1 text-center"
                      onClick={() => handleTeamClick(match.teams.team2.id)}
                    >
                      <span className="text-2xl font-bold text-white block mb-2">
                        {match.teams.team2.name}
                      </span>
                      <span className="text-xl text-gray-400">
                        {match.teams.team2.score}
                      </span>
                    </div>
                  </div>
                  {scoreType === 'live' && match.keyPlayers && (
                    <div className="mt-6 border-t border-gray-700 pt-6">
                      <div className="text-lg text-gray-400 mb-3">Key Players</div>
                      <div className="flex justify-center space-x-8">
                        {match.keyPlayers.map((player, index) => (
                          <div
                            key={index}
                            className="cursor-pointer hover:text-blue-400 transition-colors duration-200 text-center"
                            onClick={() => handlePlayerClick(player.id)}
                          >
                            <div className="font-medium text-white">{player.name}</div>
                            <div className="text-gray-400">{player.performance}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {scoreType === 'past' && (
                    <div className="mt-6 text-center">
                      <div className="text-lg text-white">{match.result}</div>
                      <div className="text-sm text-gray-400 mt-2">{match.date}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Score;