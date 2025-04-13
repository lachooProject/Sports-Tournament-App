import React from 'react';
import { Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

function AnalyticsChart({ player, sport }) {
  const getStatsConfig = () => {
    switch (sport) {
      case 'cricket':
        return {
          labels: ['Batting', 'Bowling', 'Fielding', 'Running', 'Consistency', 'Power'],
          data: [85, 70, 75, 80, 90, 85]
        };
      case 'football':
        return {
          labels: ['Speed', 'Shooting', 'Passing', 'Dribbling', 'Defense', 'Stamina'],
          data: [88, 85, 90, 75, 70, 85]
        };
      case 'badminton':
        return {
          labels: ['Smash', 'Defense', 'Agility', 'Stamina', 'Technique', 'Strategy'],
          data: [90, 85, 88, 80, 85, 90]
        };
      default:
        return {
          labels: [],
          data: []
        };
    }
  };

  const statsConfig = getStatsConfig();
  const radarData = {
    labels: statsConfig.labels,
    datasets: [{
      label: `${player?.name || 'Player'} Stats`,
      data: statsConfig.data,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgb(59, 130, 246)',
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(59, 130, 246)'
    }]
  };

  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Performance Score',
      data: [75, 82, 78, 85, 88, 90],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Performance Trend */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Performance Trend</h3>
          <div className="h-[300px]">
            <Line 
              data={performanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                  },
                  x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                  }
                },
                plugins: {
                  legend: {
                    labels: { color: 'rgba(255, 255, 255, 0.7)' }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Skills Radar */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Skills Analysis</h3>
          <div className="h-[300px]">
            <Radar 
              data={radarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.7)',
                      backdropColor: 'transparent',
                      stepSize: 20
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: {
                      color: 'rgba(255, 255, 255, 0.7)',
                      font: { size: 12 }
                    }
                  }
                },
                plugins: {
                  legend: {
                    labels: { color: 'rgba(255, 255, 255, 0.7)' }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsChart;