import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView: React.FC = () => {
  // Approximate bounds to cover all barangays of Manolo Fortich, Bukidnon
  const manoloBounds: [[number, number], [number, number]] = [
    [8.2602, 124.7740], // Southwest corner
    [8.4602, 124.9540]  // Northeast corner
  ];

  return (
    <div style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        bounds={manoloBounds}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default MapView;
