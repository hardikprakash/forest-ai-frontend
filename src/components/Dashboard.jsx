import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Stream from './Stream';

const Dashboard = ({ token, handleLogout }) => {
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
    <div className="dashboard">
      <h1>Forest Surveillance Dashboard</h1>
      
      <button onClick={handleLogout}>Logout</button>
      
      <h2>Live Stream</h2>
      <Stream token={token} />  

      <h2>PIDS Alerts</h2>
      {pidsAlerts.length > 0 ? (
        <ul>
          {pidsAlerts.map((alert, index) => (
            <li key={index}>{`Location: ${alert.location}, Level: ${alert.alert_level}`}</li>
          ))}
        </ul>
      ) : (
        <p>No alerts available.</p>
      )}
    </div>
  );
};

export default Dashboard;
