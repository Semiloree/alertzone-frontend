import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = 'http://localhost:8080/ws';

export function useWebSocket({ onIncident, onAlert }) {
  const clientRef = useRef(null);

  const connect = useCallback(() => {
    const client = new Client({
      // SockJS creates the underlying connection
      webSocketFactory: () => new SockJS(WS_URL),

      // Retry automatically if connection drops
      reconnectDelay: 5000,

      onConnect: () => {
        console.log('✅ WebSocket connected');

        // Subscribe to the main incidents channel
        client.subscribe('/topic/incidents', (message) => {
          const incident = JSON.parse(message.body);
          if (onIncident) onIncident(incident);
        });

        // Subscribe to the critical alerts channel
        client.subscribe('/topic/alerts', (message) => {
          const alert = JSON.parse(message.body);
          if (onAlert) onAlert(alert);
        });
      },

      onDisconnect: () => console.log('🔌 WebSocket disconnected'),
      onStompError: (frame) => console.error('WebSocket error:', frame),
    });

    client.activate();
    clientRef.current = client;
  }, [onIncident, onAlert]);

  useEffect(() => {
    connect();
    // Clean up when component unmounts
    return () => { if (clientRef.current) clientRef.current.deactivate(); };
  }, [connect]);

  // Expose a send function for future use (admin broadcasts etc.)
  const send = useCallback((destination, body) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    }
  }, []);

  return { send };
}