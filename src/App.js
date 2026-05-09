import React from 'react';
import AlertBanner from './components/AlertBanner';
import LiveFeed from './components/LiveFeed';

function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh',
                  background: '#0D1117', color: '#F0F4F8' }}>
      {/* Alert banner slides in from top on CRITICAL incidents */}
      <AlertBanner />

      <div style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '16px',
                     color: '#00D9B8' }}>
          ⚡ AlertZone — Live Incident Feed
        </h1>

        <div style={{ background: '#161B22', borderRadius: '12px',
                      border: '.5px solid #30363D', overflow: 'hidden' }}>
          <LiveFeed />
        </div>
      </div>
    </div>
  );
}

export default App;
