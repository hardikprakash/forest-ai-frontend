import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Stream from './Stream';

const Dashboard = ({ token, onLogout }) => { 
  const [pidsAlerts, setPidsAlerts] = useState([]);

  useEffect(() => {
    const fetchPidsAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/pids-alerts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPidsAlerts(response.data.alerts);
      } catch (error) {
        console.error('Error fetching PIDS alerts:', error);
      }
    };

    fetchPidsAlerts();
  }, [token]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Forest Surveillance Dashboard</h1>
          <button 
            onClick={onLogout} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Live Stream</h2>
          <Stream token={token} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">PIDS Alerts</h2>
          {pidsAlerts.length > 0 ? (
            <ul className="bg-gray-50 p-4 rounded-md shadow-inner">
              {pidsAlerts.map((alert, index) => (
                <li key={index} className="border-b border-gray-200 py-2 text-gray-800">
                  <span className="font-semibold">Location:</span> {alert.location}, 
                  <span className="font-semibold ml-2">Level:</span> {alert.alert_level}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">No alerts available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
