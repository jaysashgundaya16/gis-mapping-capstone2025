import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// @ts-ignore
import geojsonData from '../data/map.geojson';

// 📌 Helper: extract barangay name
const getBarangayName = (feature: any): string => {
  return feature.properties?.Barangay || 'Unknown';
};

const MapView: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);

  // ✅ If geojsonData is already an object, no need for JSON.parse
  const geojson = typeof geojsonData === 'string' ? JSON.parse(geojsonData) : geojsonData;

  // 📌 Get all unique barangay names
  const barangays: string[] = Array.from(
    new Set(geojson.features.map((feature: any) => getBarangayName(feature)))
  ).sort() as string[];

  // ✅ Start with NO barangays selected (all checkboxes unchecked)
  const [selectedBarangays, setSelectedBarangays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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

  // ✅ Default center for Manolo Fortich poblacion (Tankulan)
  const defaultCenter: [number, number] = [8.3695, 124.8643];
  const defaultZoom = 14;

  // ✅ Auto-fit bounds to selected barangays OR reset to poblacion view
  useEffect(() => {
    if (mapRef.current) {
      if (filteredGeoJSON.features.length > 0) {
        const layer = L.geoJSON(filteredGeoJSON);
        mapRef.current.fitBounds(layer.getBounds(), { padding: [20, 20], maxZoom: 15 });
      } else {
        // 👇 Default back to poblacion
        mapRef.current.setView(defaultCenter, defaultZoom);
      }
    }
  }, [filteredGeoJSON]);

  return (
    <div style={{ display: 'flex', height: '90vh', width: '100%' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #0b0b0b, #013c04ff',
        color: '#fefafaff',
        padding: '10px',
        fontSize: '14px',
        borderRight: '1px solid #444'
      }}>
        <h4>Barangays</h4>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {barangays.map((bgy) => (
            <div key={bgy}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedBarangays.includes(bgy)} // ✅ default unchecked
                  onChange={() => handleToggle(bgy)}
                />
                &nbsp;{bgy}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        {loading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(250, 248, 248, 0.6)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            zIndex: 1000
          }}>
            Loading map...
          </div>
        )}

        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
          whenReady={() => {
            setLoading(false);
            mapRef.current?.invalidateSize();
            // 👇 Force poblacion center on load
            mapRef.current?.setView(defaultCenter, defaultZoom);
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            eventHandlers={{
              load: () => {
                setLoading(false);
                mapRef.current?.invalidateSize();
              }
            }}
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
