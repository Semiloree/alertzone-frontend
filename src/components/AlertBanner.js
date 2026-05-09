import React from 'react';
import { useIncidents } from '../context/IncidentContext';

const severityColours = {
  CRITICAL: { bg: '#FF3B30', text: '#fff', icon: '🚨' },
  HIGH:     { bg: '#FF6B00', text: '#fff', icon: '⚠️' },
  MODERATE: { bg: '#F59E0B', text: '#000', icon: '⚠️' },
  LOW:      { bg: '#00D9B8', text: '#000', icon: 'ℹ️' },
};

export default function AlertBanner() {
  const { newAlert } = useIncidents();
  if (!newAlert) return null;

  const colours = severityColours[newAlert.severity] || severityColours.LOW;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 9999,
      background: colours.bg,
      color: colours.text,
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      fontWeight: 500,
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      animation: 'slideDown 0.4s ease',
    }}>
      <span style={{ fontSize: '20px' }}>{colours.icon}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: '13px', opacity: .8, textTransform:'uppercase', letterSpacing:'.05em' }}>
          {newAlert.severity} ALERT — {newAlert.category}
        </div>
        <div>{newAlert.title}</div>
      </div>
    </div>
  );
}