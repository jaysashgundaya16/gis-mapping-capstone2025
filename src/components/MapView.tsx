import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// @ts-ignore
import geojsonText from '../data/map.geojson';

// 📌 Helper: extract barangay name from properties (uses key name)
const getBarangayName = (feature: any): string => {
   return feature.properties?.Barangay || 'Unknown';
};
const MapView: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const geojson = JSON.parse(geojsonText);

  // 📌 Get all unique barangay names
  const barangays: string[] = Array.from(
    new Set(geojson.features.map((feature: any) => getBarangayName(feature)))
  ).sort() as string[];

  const [selectedBarangays, setSelectedBarangays] = useState<string[]>(barangays);

  const handleToggle = (barangay: string) => {
    setSelectedBarangays(prev =>
      prev.includes(barangay)
        ? prev.filter(b => b !== barangay)
        : [...prev, barangay]
    );
  };

  const filteredGeoJSON = {
    ...geojson,
    features: geojson.features.filter((f: any) =>
      selectedBarangays.includes(getBarangayName(f))
    )
  };

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 200);
    }
  }, []);

  return (
    <div style={{ display: 'flex', height: '90vh', width: '100%' }}>
      {/* ✅ Sidebar */}
      <div style={{
          width: '250px',
          overflowY: 'auto',
          background: '#000',
          color: '#fff',
          padding: '10px',
          fontSize: '14px',
          borderRight: '1px solid #444'
     }}>

        <h4>Barangays</h4>
        {barangays.map((bgy) => (
          <div key={bgy}>
            <label>
              <input
                type="checkbox"
                checked={selectedBarangays.includes(bgy)}
                onChange={() => handleToggle(bgy)}
              />
              &nbsp;{bgy}
            </label>
          </div>
        ))}
      </div>

      {/* 🗺️ Map */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[8.3602, 124.8640]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          whenReady={() => {
            if (!mapRef.current) {
              // @ts-ignore
              mapRef.current = (window as any).L?.map?.instances?.[0] || undefined;
            }
          }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
            data={filteredGeoJSON}
            style={{ color: 'orange', weight: 2, fillOpacity: 0.4 }}
            onEachFeature={(feature, layer) => {
              const name = getBarangayName(feature);
              layer.bindTooltip(name);
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;