import React from 'react';
import { useIncidents } from '../context/IncidentContext';
import LoadingSpinner from '../components/LoadingSpinner';

const severityColor = { CRITICAL:'#FF3B30', HIGH:'#FF6B00', MODERATE:'#F59E0B', LOW:'#00D9B8' };
const categoryIcon  = { INSECURITY:'🔫', ROAD_HAZARD:'🚧', EMERGENCY:'🚑', OUTAGE:'⚡', OTHER:'📍' };

export default function LiveFeed() {
  const { incidents, loading } = useIncidents();

  if (loading) return <LoadingSpinner message="Loading incidents…" />;

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {incidents.map((inc, i) => (
        <div key={inc.id ?? i} style={{
          padding: '12px 16px',
          borderBottom: '.5px solid var(--color-border-tertiary)',
          animation: 'markerPop 0.4s ease',
          borderLeft: `3px solid ${severityColor[inc.severity] || '#ccc'}`,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'3px' }}>
            <span>{categoryIcon[inc.category] || '📍'}</span>
            <span style={{ fontSize:'13px', fontWeight:500, color:'var(--color-text-primary)' }}>
              {inc.title}
            </span>
          </div>
          <div style={{ fontSize:'11px', color:'var(--color-text-secondary)' }}>
            {inc.severity} · {inc.category} · {inc.status}
          </div>
          <div style={{ fontSize:'11px', color:'var(--color-text-tertiary)', marginTop:'2px' }}>
            {inc.reporterName} · {new Date(inc.createdAt).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
}