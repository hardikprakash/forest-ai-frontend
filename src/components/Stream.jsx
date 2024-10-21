import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Stream = ({ token }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [streamError, setStreamError] = useState(''); 
  const [alertsError, setAlertsError] = useState(''); 

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const response = await axios.get('http://localhost:8000/stream', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', 
        });
        
        const imageUrl = URL.createObjectURL(response.data); 
        setImageSrc(imageUrl);
        setStreamError(''); 
      } catch (error) {
        setStreamError('Failed to load the stream. Please try again later.'); 
        console.error('Error fetching stream:', error);
      }
    };

    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/alerts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAlerts(response.data.alerts);
        setAlertsError('');
      } catch (error) {
        setAlertsError('Failed to load alerts. Please try again later.');
        console.error('Error fetching alerts:', error);
      }
    };

    fetchStream();
    fetchAlerts();
    const streamInterval = setInterval(fetchStream, 2000);
    const alertInterval = setInterval(fetchAlerts, 5000); 

    
    return () => {
      clearInterval(streamInterval);
      clearInterval(alertInterval);
    };
  }, [token]);

  return (
    <div className="stream-container">
      <h2>Live Stream</h2>
      {streamError ? (
        <p className="error">{streamError}</p>
      ) : (
        imageSrc && <img src={imageSrc} alt="Live Stream" style={{ width: '100%', height: 'auto' }} />
      )}
      
      <h3>Active Alerts</h3>
      {alertsError ? ( 
        <p className="error">{alertsError}</p>
      ) : (
        <ul>
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <li key={index}>
                <strong>Location:</strong> {alert.location}, <strong>Level:</strong> {alert.alert_level}
              </li>
            ))
          ) : (
            <p>No active alerts</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Stream;
