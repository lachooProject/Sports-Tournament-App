import React from 'react';

function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {stats.map((stat, index) => (
        <div key={index} className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-medium text-gray-400 mb-2">{stat.label}</h3>
          <p className={`text-3xl font-bold ${stat.color || 'text-white'}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default StatsGrid;