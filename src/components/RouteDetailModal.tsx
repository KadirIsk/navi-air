import React, { useEffect, useState, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { type RouteDetail } from '../services/routeService';
import { getCoordinates } from '../services/geocodingService';

const TRANSPORT_ICONS: Record<string, string> = {
  'FLIGHT': '✈️',
  'BUS': '🚌',
  'SUBWAY': '🚇',
  'UBER': '🚗'
};

interface RouteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: RouteDetail | null;
}

const RouteDetailModal: React.FC<RouteDetailModalProps> = ({ isOpen, onClose, route }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [coords, setCoords] = useState<Record<string, [number, number]>>({});

  useEffect(() => {
    if (isOpen && route) {
      const fetchCoords = async () => {
        const uniqueLocations = new Set<string>();
        route.steps.forEach(step => {
          uniqueLocations.add(step.origin);
          uniqueLocations.add(step.destination);
        });

        const newCoords: Record<string, [number, number]> = {};
        for (const loc of uniqueLocations) {
          const searchQuery = loc.replace(/\s*\(.*?\)\s*/g, '').trim();
          const query = searchQuery.length > 1 ? searchQuery : loc;
          
          const coordinates = await getCoordinates(query);
          if (coordinates) {
            newCoords[loc] = coordinates;
          }
        }
        setCoords(newCoords);
      };
      fetchCoords();
    } else {
        setCoords({});
    }
  }, [isOpen, route]);

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([41.0082, 28.9784], 6);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) return;
      map.removeLayer(layer);
    });

    if (route && Object.keys(coords).length > 0) {
      const points: [number, number][] = [];

      route.steps.forEach((step) => {
        const start = coords[step.origin];
        const end = coords[step.destination];

        if (start && end) {
          points.push(start);
          points.push(end);

          L.polyline([start, end], { color: '#2196F3', weight: 4, dashArray: '10, 10', opacity: 0.7 }).addTo(map);

          const midLat = (start[0] + end[0]) / 2;
          const midLng = (start[1] + end[1]) / 2;
          const iconChar = TRANSPORT_ICONS[step.transportationType] || '➡️';
          
          const transportIcon = L.divIcon({
            className: '',
            html: `<div style="
              background-color: white; 
              width: 32px; 
              height: 32px; 
              border-radius: 50%; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              font-size: 18px; 
              border: 2px solid #2196F3; 
              box-shadow: 0 2px 5px rgba(0,0,0,0.3);
              color: #333;
            ">${iconChar}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          L.marker([midLat, midLng], { icon: transportIcon, zIndexOffset: 1000 }).addTo(map);

          const createMarker = (latlng: [number, number], title: string) => {
             L.circleMarker(latlng, {
               radius: 6,
               fillColor: "#fff",
               color: "#2196F3",
               weight: 2,
               opacity: 1,
               fillOpacity: 1
             }).addTo(map).bindPopup(title);
          };

          createMarker(start, step.origin);
          createMarker(end, step.destination);
        }
      });

      if (points.length > 0) {
        map.fitBounds(points, { padding: [50, 50] });
      }
    }

  }, [isOpen, coords, route]);

  useEffect(() => {
    if (!isOpen && mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
    }} onClick={onClose}>
      <div style={{
        width: '90%', height: '80%', backgroundColor: '#1a1a1a', borderRadius: '8px', 
        display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ padding: '15px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <h3 style={{ margin: 0 }}>Route Map: {route?.title}</h3>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>

        {/* Route Steps Visualizer */}
        <div className="route-visualizer">
          {route?.steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="visualizer-step">
                <div className={`visualizer-dot ${index === 0 ? 'start' : ''}`}></div>
                <div className="visualizer-label">{step.origin}</div>
              </div>
              
              <div className="visualizer-connector">
                <div className="connector-line"></div>
                <div className="connector-badge">
                  {step.transportationType}
                </div>
              </div>

              {index === route.steps.length - 1 && (
                <div className="visualizer-step">
                  <div className="visualizer-dot end"></div>
                  <div className="visualizer-label">{step.destination}</div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Map Container - Kesin yükseklik verildi */}
        <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
             <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
        </div>

      </div>
    </div>
  );
};

export default RouteDetailModal;
