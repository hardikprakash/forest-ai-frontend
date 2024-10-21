import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard'; 
import axios from 'axios';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.post(
            'http://localhost:8000/verify-token',
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status !== 200) {
            setToken('');
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Invalid token, logging out.');
          setToken(''); 
          localStorage.removeItem('token');
        }
      }
    };

    verifyToken();
  }, [token]);

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <Routes>
        {/* Redirect to the dashboard if token is valid, otherwise render Login */}
        <Route 
          path="/" 
          element={token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />} 
        />
        
        <Route 
          path="/dashboard" 
          element={token ? <Dashboard token={token} handleLogout={handleLogout} /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
