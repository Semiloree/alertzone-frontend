import L from 'leaflet';

const colours = {
  CRITICAL: '#FF3B30',
  HIGH:     '#FF6B00',
  MODERATE: '#F59E0B',
  LOW:      '#00D9B8',
};

export function createMarkerIcon(severity) {
  const colour = colours[severity] || '#8B949E';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.27 21.73 0 14 0z"
            fill="${colour}" opacity="0.95"/>
      <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
    </svg>`;
  return L.divIcon({
    html: `<div style="animation:markerPop .4s ease">${svg}</div>`,
    className: '',
    iconSize:    [28, 36],
    iconAnchor:  [14, 36],
    popupAnchor: [0, -36],
  });
}