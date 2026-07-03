import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useWebSocket } from '../hooks/useWebSocket';

const API = `${process.env.REACT_APP_API_URL}/api`;

const IncidentContext = createContext();

export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [newAlert, setNewAlert]   = useState(null);

  // Load existing incidents from REST API on first render
  useEffect(() => {
    axios.get(`${API}/incidents`)
      .then(res => setIncidents(res.data))
      .catch(err => console.error('Failed to load incidents', err))
      .finally(() => setLoading(false));
  }, []);

  // Called by WebSocket hook when a new incident or update arrives
  const handleIncident = useCallback((message) => {
    if (message.eventType === 'NEW_INCIDENT') {
      // Prepend to list so newest appears first
      setIncidents(prev => [message, ...prev]);
    } else if (message.eventType === 'STATUS_UPDATE') {
      // Replace the old version with the updated one
      setIncidents(prev =>
        prev.map(inc => inc.id === message.id ? message : inc)
      );
    }
  }, []);

  // Called when a CRITICAL alert arrives
  const handleAlert = useCallback((alert) => {
    setNewAlert(alert);
    // Auto-clear after 8 seconds
    setTimeout(() => setNewAlert(null), 8000);
  }, []);

  // Connect WebSocket — runs once, stays alive for the whole session
  useWebSocket({ onIncident: handleIncident, onAlert: handleAlert });

  return (
    <IncidentContext.Provider value={{ incidents, loading, newAlert }}>
      {children}
    </IncidentContext.Provider>
  );
}

// Custom hook for easy access anywhere
export const useIncidents = () => useContext(IncidentContext);