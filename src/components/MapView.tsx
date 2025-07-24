import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// @ts-ignore
import geojsonText from '../data/map.geojson';
import L from 'leaflet';

const MapView: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const geojson = JSON.parse(geojsonText);

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 200); // delay helps when using Ionic transitions
    }
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <MapContainer
        center={[8.3602, 124.8640]}
        zoom={12}
        whenReady={() => {
          if (mapRef.current === null) {
            // @ts-ignore
            mapRef.current = (window as any).L?.map?.instances?.[0] || undefined;
          }
        }}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={geojson} style={{ color: 'orange', weight: 2, fillOpacity: 0.3 }} />
      </MapContainer>
    </div>
  );
};

export default MapView;
