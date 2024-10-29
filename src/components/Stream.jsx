import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Stream = ({ token }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [streamError, setStreamError] = useState(''); 
  const [alertsError, setAlertsError] = useState(''); 
  const [isStreamLoading, setIsStreamLoading] = useState(true);
  const [areAlertsLoading, setAreAlertsLoading] = useState(true);

  useEffect(() => {
    const fetchStream = async () => {
      setIsStreamLoading(true);
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
      setIsStreamLoading(false);
    };

    const fetchAlerts = async () => {
      setAreAlertsLoading(true);
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
      setAreAlertsLoading(false);
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
    <div className="stream-container p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Live Stream</h2>
      {isStreamLoading ? (
        <p className="text-gray-500">Loading stream...</p>
      ) : streamError ? ( 
        <p className="text-red-500">{streamError}</p>
      ) : (
        imageSrc && <img src={imageSrc} alt="Live Stream" className="w-full h-auto rounded-md shadow" />
      )}
      
      <h3 className="text-lg font-semibold mt-6">Active Alerts</h3>
      {areAlertsLoading ? (
        <p className="text-gray-500">Loading alerts...</p>
      ) : alertsError ? ( 
        <p className="text-red-500">{alertsError}</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <li key={index} className="p-2 bg-blue-100 rounded-md">
                <strong>Location:</strong> {alert.location}, <strong>Level:</strong> {alert.alert_level}
              </li>
            ))
          ) : (
            <p className="text-gray-500">No active alerts</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Stream;
