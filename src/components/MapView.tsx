import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";

// @ts-ignore
import geojsonData from "../data/map.geojson?url";
// @ts-ignore
import lingionDataUrl from "../data/Lingi-on.geojson?url"; // ✅ load as file URL

// 📌 Helper: extract barangay name
const getBarangayName = (feature: any): string => {
  const props = feature.properties || {};
  return props.Barangay || Object.keys(props)[0] || "Unknown";
};

// 📍 Custom marker icon
const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapViewProps {
  markers?: Array<{
    latitude: number;
    longitude: number;
    [key: string]: any;
  }>;
  clickToSet?: boolean;
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
}

const MapView: React.FC<MapViewProps> = ({
  markers = [],
  clickToSet = false,
  onMapClick,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const [geojson, setGeojson] = useState<any>(null);
  const [lingionGeoJSON, setLingionGeoJSON] = useState<any>(null);
  const [selectedBarangays, setSelectedBarangays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [farmMarkers, setFarmMarkers] = useState<any[]>([]);

  // ✅ Load both GeoJSON files safely
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const [mapRes, lingionRes] = await Promise.all([
          fetch(geojsonData).then((res) => res.json()),
          fetch(lingionDataUrl).then((res) => res.json()),
        ]);
        setGeojson(mapRes);
        setLingionGeoJSON(lingionRes);
      } catch (err) {
        console.error("❌ Failed to load GeoJSON files:", err);
      } finally {
        setLoading(false);
      }
    };
    loadFiles();
  }, []);

  // ✅ Realtime listener for Firestore farms
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "farms"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFarmMarkers(data);
    });
    return () => unsub();
  }, []);

  const handleToggle = (barangay: string) => {
    setSelectedBarangays((prev) =>
      prev.includes(barangay)
        ? prev.filter((b) => b !== barangay)
        : [...prev, barangay]
    );
  };

  const defaultCenter: [number, number] = [8.3695, 124.8643];
  const defaultZoom = 14;

  const filteredGeoJSON =
    geojson && geojson.features
      ? {
          ...geojson,
          features: geojson.features.filter((f: any) =>
            selectedBarangays.includes(getBarangayName(f))
          ),
        }
      : null;

  useEffect(() => {
    if (mapRef.current && filteredGeoJSON && filteredGeoJSON.features.length > 0) {
      const layer = L.geoJSON(filteredGeoJSON);
      mapRef.current.fitBounds(layer.getBounds(), {
        padding: [20, 20],
        maxZoom: 15,
      });
    } else {
      mapRef.current?.setView(defaultCenter, defaultZoom);
    }
  }, [filteredGeoJSON]);

  const barangays: string[] =
    (geojson?.features
      ?.map((feature: any) => getBarangayName(feature)) ?? [])
      .filter((v: any): v is string => Boolean(v))
      .sort();

  return (
    <div style={{ display: "flex", height: "90vh", width: "100%" }}>
      {/* 📋 Sidebar */}
      <div
        style={{
          width: "250px",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0b0b0b, #013c04ff)",
          color: "#fefafaff",
          padding: "10px",
          fontSize: "14px",
          borderRight: "1px solid #444",
        }}
      >
        <h4>Barangays</h4>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {barangays.map((bgy: string) => (
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
      </div>

      {/* 🗺️ Map */}
      <div style={{ flex: 1, position: "relative" }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "8px",
              zIndex: 1000,
            }}
          >
            Loading map...
          </div>
        )}

        {!loading && (
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
            whenReady={() => {
              mapRef.current?.invalidateSize();
              mapRef.current?.setView(defaultCenter, defaultZoom);
            }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 🟠 Main Barangay Layer */}
            {filteredGeoJSON && (
              <GeoJSON
                data={filteredGeoJSON}
                style={{ color: "orange", weight: 2, fillOpacity: 0.4 }}
                onEachFeature={(feature, layer) => {
                  const name = getBarangayName(feature);
                  layer.bindTooltip(name);
                }}
              />
            )}

            {/* 🔴 Separate Lingi-on Layer */}
            {lingionGeoJSON && (
              <GeoJSON
                data={lingionGeoJSON}
                style={{ color: "black", weight: 3, fillOpacity: 0.15 }}
                onEachFeature={(feature, layer) => {
                  layer.bindTooltip("Lingi-on (Updated Border)");
                }}
              />
            )}

           
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default MapView;
