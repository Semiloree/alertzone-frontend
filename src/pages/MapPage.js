import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useIncidents } from '../context/IncidentContext';
import { createMarkerIcon } from '../utils/mapMarkers';
import AlertBanner from '../components/AlertBanner';
import LiveFeed from '../components/LiveFeed';
import PageWrapper from '../components/PageWrapper';
import LoadingSpinner from '../components/LoadingSpinner';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet'
import HeatmapLayer from '../components/HeatmapLayer';


const CATEGORIES = ['ALL','INSECURITY','ROAD_HAZARD','EMERGENCY','OUTAGE','OTHER'];
const SEVERITIES = ['ALL','CRITICAL','HIGH','MODERATE','LOW'];
const catIcon    = { INSECURITY:'🔫', ROAD_HAZARD:'🚧', EMERGENCY:'🚑', OUTAGE:'⚡', OTHER:'📍' };

// Keeps map centred on Nigeria by default
function MapCentre() {
  const map = useMap();
  React.useEffect(() => { map.setView([9.082, 8.6753], 6); }, [map]);
  return null;
}

export default function MapPage() {
  const { incidents, loading } = useIncidents();
  const [catFilter, setCat] = useState('ALL');
  const [sevFilter, setSev] = useState('ALL');
  const [showFeed, setShowFeed] = useState(window.innerWidth > 768);
  const [showHeat, setShowHeat] = useState(false);

  const filtered = incidents.filter(inc =>
    (catFilter === 'ALL' || inc.category === catFilter) &&
    (sevFilter === 'ALL' || inc.severity === sevFilter)
  );

  if (loading) return <LoadingSpinner message="Loading incidents…" />;

  return (
    <PageWrapper>
    <div className="flex h-screen pt-14 bg-[#0D1117]">
      <AlertBanner />

      {/* ── Left side: map ── */}
      <div className="relative flex-1">

        {/* Filter bar */}
        <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap gap-2">
          <select value={catFilter} onChange={e => setCat(e.target.value)}
            className="bg-[#161B22]/90 backdrop-blur border border-[#30363D] rounded-xl
                       px-3 py-1.5 text-xs text-[#F0F4F8] focus:outline-none
                       focus:border-[#00D9B8] cursor-pointer">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={sevFilter} onChange={e => setSev(e.target.value)}
            className="bg-[#161B22]/90 backdrop-blur border border-[#30363D] rounded-xl
                       px-3 py-1.5 text-xs text-[#F0F4F8] focus:outline-none
                       focus:border-[#00D9B8] cursor-pointer">
            {SEVERITIES.map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="bg-[#161B22]/90 backdrop-blur border border-[#30363D]
                          rounded-xl px-3 py-1.5 text-xs text-[#8B949E]">
            {loading ? 'Loading…' : `${filtered.length} incident${filtered.length!==1?'s':''}`}
          </div>
          <button onClick={() => setShowFeed(f => !f)}
            className="ml-auto bg-[#161B22]/90 backdrop-blur border border-[#30363D]
                       rounded-xl px-3 py-1.5 text-xs text-[#8B949E]
                       hover:text-[#00D9B8] hover:border-[#00D9B8] transition-colors">
            {showFeed ? 'Hide Feed' : 'Show Feed'}
          </button>
          <button onClick={() => setShowHeat(h => !h)}
  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border
    ${showHeat
      ? 'bg-[#FF3B30]/20 border-[#FF3B30]/60 text-[#FF3B30]'
      : 'bg-[#161B22]/90 backdrop-blur border-[#30363D] text-[#8B949E] hover:text-[#F0F4F8]'
    }`}>
  🔥 {showHeat ? 'Heatmap ON' : 'Heatmap'}
</button>
        </div>

        {/* Leaflet map */}
        <MapContainer center={[9.082, 8.6753]} zoom={6}
          style={{ height: '100%', width: '100%', background: '#0D1117' }}>
          <MapCentre />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='© OpenStreetMap & CartoDB'
          />
          {showHeat && <HeatmapLayer incidents={incidents} />}
          <MarkerClusterGroup
  chunkedLoading
  iconCreateFunction={(cluster) => {
    const count = cluster.getChildCount();
    const size = count < 10 ? 36 : count < 50 ? 44 : 52;

    return L.divIcon({
      html: `
        <div style="
          width:${size}px;
          height:${size}px;
          background: rgba(0,217,184,0.15);
          border:2px solid #00D9B8;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#00D9B8;
          font-weight:700;
          font-size:13px;
          backdrop-filter:blur(4px);
        ">
          ${count}
        </div>
      `,
      className: '',
      iconSize: [size, size],
    });
  }}
>
  {filtered.map((inc, i) => (
    inc.latitude && inc.longitude ? (
      <Marker
        key={inc.id ?? i}
        position={[inc.latitude, inc.longitude]}
        icon={createMarkerIcon(inc.severity)}
      >
        <Popup>
          <div style={{ fontFamily:'Inter,sans-serif', minWidth:'180px' }}>
            <div style={{ fontWeight:600, fontSize:'13px', marginBottom:'4px' }}>
              {catIcon[inc.category] || '📍'} {inc.title}
            </div>

            <div style={{ fontSize:'11px', color:'#555', marginBottom:'2px' }}>
              Severity: <strong>{inc.severity}</strong>
            </div>

            <div style={{ fontSize:'11px', color:'#555', marginBottom:'2px' }}>
              Status: {inc.status}
            </div>

            <div style={{ fontSize:'11px', color:'#888' }}>
              Reported by {inc.reporterName}
            </div>
          </div>
        </Popup>
      </Marker>
    ) : null
  ))}
</MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* ── Right side: live feed ── */}
      {showFeed && (
        <div className="w-80 bg-[#161B22] border-l border-[#30363D] flex flex-col
                        overflow-hidden animate-fade-in">
          <div className="px-4 py-3 border-b border-[#30363D] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse"></span>
            <span className="text-sm font-medium text-[#F0F4F8]">Live Feed</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <LiveFeed />
          </div>
        </div>
      )}
    </div>
    </PageWrapper>
  );
}
