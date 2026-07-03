import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

// Severity weight — critical incidents burn hotter on the heatmap
const severityWeight = { CRITICAL: 1.0, HIGH: 0.75, MODERATE: 0.5, LOW: 0.25 };

export default function HeatmapLayer({ incidents }) {
  const map = useMap();

  useEffect(() => {
    if (!incidents || incidents.length === 0) return;

    // Build the [lat, lng, intensity] array Leaflet.heat expects
    const points = incidents
      .filter(inc => inc.latitude && inc.longitude)
      .map(inc => [
        inc.latitude,
        inc.longitude,
        severityWeight[inc.severity] ?? 0.5,
      ]);

    const heatLayer = L.heatLayer(points, {
      radius:  35,
      blur:    20,
      maxZoom: 10,
      max:     1.0,
      gradient: {
        0.0: '#00D9B8',   // teal  — low density
        0.4: '#F59E0B',   // amber — medium density
        0.7: '#FF6B00',   // orange
        1.0: '#FF3B30',   // red   — high density / critical
      },
    });

    heatLayer.addTo(map);

    // Clean up when incidents change or component unmounts
    return () => { map.removeLayer(heatLayer); };
  }, [map, incidents]);

  return null; // this component renders nothing itself — it draws on the map
}