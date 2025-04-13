import React from 'react';

function SportSelector({ selectedSport, onSportChange, sports }) {
  return (
    <div className="flex justify-center space-x-4 mb-12">
      {sports.map(sport => (
        <button
          key={sport}
          onClick={() => onSportChange(sport)}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            selectedSport === sport 
              ? 'bg-blue-600 text-white shadow-lg scale-105' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {sport.charAt(0).toUpperCase() + sport.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default SportSelector;