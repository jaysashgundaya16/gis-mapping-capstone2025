import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";

// @ts-ignore
import geojsonData from "../data/map.geojson?url";
// @ts-ignore
import lingionDataUrl from "../data/Lingi-on.geojson?url";
// @ts-ignore
import sangkananDataUrl from "../data/sangkanan.geojson?url";
// @ts-ignore
import tankulanDataUrl from "../data/tankulan.geojson?url";
// @ts-ignore
import dalirigDataUrl from "../data/dalirig.geojson?url";


// ✅ Helper to get barangay name
const getBarangayName = (feature: any): string => {
  const props = feature.properties || {};
  return props.Barangay || Object.keys(props)[0] || "Unknown";
};

// ✅ Custom green marker
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

// ✅ Map click handler
const MapClickHandler: React.FC<{
  clickToSet?: boolean;
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
}> = ({ clickToSet, onMapClick }) => {
  useMapEvents({
    click(e) {
      if (clickToSet && onMapClick) onMapClick(e.latlng);
    },
  });
  return null;
};

const MapView: React.FC<MapViewProps> = ({
  markers = [],
  clickToSet = false,
  onMapClick,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const [geojson, setGeojson] = useState<any>(null);
  const [lingionGeoJSON, setLingionGeoJSON] = useState<any>(null);
  const [sangkananGeoJSON, setSangkananGeoJSON] = useState<any>(null);
  const [tankulanGeoJSON, setTankulanGeoJSON] = useState<any>(null);
  const [dalirigGeoJSON, setDalirigGeoJSON] = useState<any>(null);
  const [selectedBarangay, setSelectedBarangay] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [farmMarkers, setFarmMarkers] = useState<any[]>([]);
  const [showBorders, setShowBorders] = useState(false);

  const defaultCenter: [number, number] = [8.3695, 124.8643];
  const defaultZoom = 11;

  // ✅ Load GeoJSON files
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const [main, lingion, sangkanan, tankulan, dalirig] = await Promise.all([
          fetch(geojsonData).then((res) => res.json()),
          fetch(lingionDataUrl).then((res) => res.json()),
          fetch(sangkananDataUrl).then((res) => res.json()),
          fetch(tankulanDataUrl).then((res) => res.json()),
          fetch(dalirigDataUrl).then((res) => res.json()),
        ]);
        setGeojson(main);
        setLingionGeoJSON(lingion);
        setSangkananGeoJSON(sangkanan);
        setTankulanGeoJSON(tankulan);
        setDalirigGeoJSON(dalirig);
      } catch (err) {
        console.error("❌ GeoJSON loading error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadFiles();
  }, []);

  // ✅ Firestore farms
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

  // ✅ Barangay select handler
  const handleBarangaySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (selectedBarangay === value || value === "") {
      // Deselect → Zoom out
      setSelectedBarangay("");
      setShowBorders(false);
      if (mapRef.current) {
        mapRef.current.setView(defaultCenter, defaultZoom);
      }
    } else {
      // Select → Zoom in
      setSelectedBarangay(value);
      setShowBorders(true);
    }
  };

  // ✅ Filtered GeoJSON (for selected barangay)
  const filteredGeoJSON =
    geojson && selectedBarangay
      ? {
          ...geojson,
          features: geojson.features.filter(
            (f: any) => getBarangayName(f) === selectedBarangay
          ),
        }
      : null;

  // ✅ Adjust zoom to barangay bounds
  useEffect(() => {
    if (mapRef.current && filteredGeoJSON && filteredGeoJSON.features.length > 0) {
      const layer = L.geoJSON(filteredGeoJSON);
      mapRef.current.fitBounds(layer.getBounds(), { padding: [20, 20], maxZoom: 15 });
    }
  }, [filteredGeoJSON]);

  const barangays: string[] =
    geojson?.features
      ?.map((feature: any) => getBarangayName(feature))
      .filter(Boolean)
      .sort() ?? [];

  return (
    <div style={{ display: "flex", height: "100%", width: "100%" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "245px",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #ccc",
          padding: "15px",
          overflowY: "auto",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header with DA logo */}
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <img
            src="https://scontent.fmnl13-3.fna.fbcdn.net/v/t1.15752-9/566582844_1306498070781604_8401820456558094869_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeFF06cdkjGbhGXdlRgLuYJgBU5WPDAv4eIFTlY8MC_h4m9B-H74BDQVv45n8eFSHHVeF6CyO92_PgK2-mJFVk0l&_nc_ohc=adtClkziJnwQ7kNvwHwMp6J&_nc_oc=AdkM68JhRwrLBRBr6Go8-9JIzxD-100p_qaGi0-niMiASr8bLCRPw7XGQPv8boIsYho&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fmnl13-3.fna&oh=03_Q7cD3gFHO-zKKdztUc6lYH5TX_TDmQvkiExR1OFBx80gETYBQg&oe=6923B7C1"
            alt="Department of Agriculture Logo"
            style={{ width: "147px", marginBottom: "5px" }}
          />
          <h3 style={{ fontSize: "14px", marginBottom: "10px" }}>
            Department of Agriculture
          </h3>
        </div>

        {/* Dropdowns */}
        <div
          style={{
            background: "#f8f8f8",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "inset 0 0 4px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontWeight: "bold" }}>Region:</label>
            <select style={{ width: "100%", padding: "6px" }} disabled>
              <option>Region X</option>
            </select>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontWeight: "bold" }}>Province:</label>
            <select style={{ width: "100%", padding: "6px" }} disabled>
              <option>Bukidnon</option>
            </select>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontWeight: "bold" }}>Municipality:</label>
            <select style={{ width: "100%", padding: "6px" }} disabled>
              <option>Manolo Fortich</option>
            </select>
          </div>
          

          <div>
            <label style={{ fontWeight: "bold" }}>Barangay:</label>
            <select
              onChange={handleBarangaySelect}
              value={selectedBarangay}
              style={{ width: "100%", padding: "6px" }}
            >
              <option value="">Select Barangay</option>
              {barangays.map((bgy) => (
                <option key={bgy} value={bgy}>
                  {bgy}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: "bold" }}>Choose Crop:</label>
            <select style={{ width: "100%", padding: "6px", marginTop: "4px" }}>
              <option>Corn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map */}
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
          >
            <MapClickHandler clickToSet={clickToSet} onMapClick={onMapClick} />

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Only show barangay borders when selected */}
            {showBorders && filteredGeoJSON && (
              <GeoJSON
                data={filteredGeoJSON}
                style={{ color: "transparent", weight: 2, fillOpacity: 0.2 }}
              />
            )}

            {/* Other barangay GeoJSONs */}
            {lingionGeoJSON && (
              <GeoJSON data={lingionGeoJSON} style={{ color: "green", weight: 2 }} />
            )}
            {sangkananGeoJSON && (
              <GeoJSON data={sangkananGeoJSON} style={{ color: "green", weight: 2 }} />
            )}
            {tankulanGeoJSON && (
              <GeoJSON data={tankulanGeoJSON} style={{ color: "green", weight: 2 }} />
            )}
            {dalirigGeoJSON && (
              <GeoJSON data={dalirigGeoJSON} style={{ color: "green", weight: 2 }} />
            )}

            {/* Farm Markers */}
            {farmMarkers.map((farm, idx) => (
              <Marker
                key={idx}
                position={[farm.latitude, farm.longitude]}
                icon={greenIcon}
              >
                <Popup>
                  <b>Farmer:</b> {farm.farmerName || "N/A"} <br />
                  <b>Crop:</b> {farm.cropType || "N/A"} <br />
                  <b>Barangay:</b> {farm.barangay || "Unknown"}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default MapView;


