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
// @ts-ignore
import dicklumDataUrl from "../data/dicklum.geojson?url";
// @ts-ignore
import santoNinoDataUrl from "../data/santoNino.geojson?url";
// @ts-ignore
import lunocanDataUrl from "../data/lunocan.geojson?url";
// @ts-ignore
import mantibugaoDataUrl from "../data/mantibugao.geojson?url";
// @ts-ignore
import minsuroDataUrl from "../data/minsuro.geojson?url";
// @ts-ignore
import damilagDataUrl from "../data/damilag.geojson?url";
// @ts-ignore
import sanMiguelDataUrl from "../data/sanMiguel.geojson?url";
// @ts-ignore
import alaeDataUrl from "../data/alae.geojson?url";
// @ts-ignore
import mambatanganDataUrl from "../data/mambatangan.geojson?url";
// @ts-ignore
import agusanCanyonDataUrl from "../data/agusanCanyon.geojson?url";
// @ts-ignore
import mampayagDataUrl from "../data/mampayag.geojson?url";
// @ts-ignore
import lindabanDataUrl from "../data/lindaban.geojson?url";
// @ts-ignore
import kalugmananDataUrl from "../data/kalugmanan.geojson?url";



// ✅ Helper to get barangay name
const getBarangayName = (feature: any): string => {
  const props = feature.properties || {};
  return props.Barangay || Object.keys(props)[0] || "Unknown";
};

// ✅ Custom icons (color-coded per crop)
const cornIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -25],
});

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
  const [dicklumGeoJSON, setDicklumGeoJSON] = useState<any>(null);
  const [santoNinoGeoJSON, setSantoNinoGeoJSON] = useState<any>(null);
  const [lunocanGeoJSON, setLunocanGeoJSON] = useState<any>(null);
  const [mantibugaoGeoJSON, setMantibugaoGeoJSON] = useState<any>(null);
  const [minsuroGeoJSON, setMinsuroGeoJSON] = useState<any>(null);
  const [damilagGeoJSON, setDamilagGeoJSON] = useState<any>(null);
  const [sanMiguelGeoJSON, setSanMiguelGeoJSON] = useState<any>(null);
  const [alaeGeoJSON, setAlaeGeoJSON] = useState<any>(null);
  const [mambatanganGeoJSON, setMambatanganGeoJSON] = useState<any>(null);
  const [agusanCanyonGeoJSON, setAgusanCanyonGeoJSON] = useState<any>(null);
  const [mampayagGeoJSON, setMampayagGeoJSON] = useState<any>(null);
  const [lindabanGeoJSON, setLindabanGeoJSON] = useState<any>(null);
  const [kalugmananGeoJSON, setKalugmananGeoJSON] = useState<any>(null);

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
        const [main, lingion, sangkanan, tankulan, dalirig, dicklum, santoNino, lunocan, mantibugao, minsuro, damilag, sanMiguel, alae, mambatangan, agusanCanyon, mampayag, lindaban, kalugmanan] = await Promise.all([
          fetch(geojsonData).then((res) => res.json()),
          fetch(lingionDataUrl).then((res) => res.json()),
          fetch(sangkananDataUrl).then((res) => res.json()),
          fetch(tankulanDataUrl).then((res) => res.json()),
          fetch(dalirigDataUrl).then((res) => res.json()),
          fetch(dicklumDataUrl).then((res) => res.json()),
          fetch(santoNinoDataUrl).then((res) => res.json()),
          fetch(lunocanDataUrl).then((res) => res.json()),
          fetch(mantibugaoDataUrl).then((res) => res.json()),
          fetch(minsuroDataUrl).then((res) => res.json()),
          fetch(damilagDataUrl).then((res) => res.json()),
          fetch(sanMiguelDataUrl).then((res) => res.json()),
          fetch(alaeDataUrl).then((res) => res.json()),
          fetch(mambatanganDataUrl).then((res) => res.json()),
          fetch(agusanCanyonDataUrl).then((res) => res.json()),
          fetch(mampayagDataUrl).then((res) => res.json()),
          fetch(lindabanDataUrl).then((res) => res.json()),
          fetch(kalugmananDataUrl).then((res) => res.json()),
          

          

        ]);
        setGeojson(main);
        setLingionGeoJSON(lingion);
        setSangkananGeoJSON(sangkanan);
        setTankulanGeoJSON(tankulan);
        setDalirigGeoJSON(dalirig);
        setDicklumGeoJSON(dicklum);
        setSantoNinoGeoJSON(santoNino);
        setLunocanGeoJSON(lunocan);
        setMantibugaoGeoJSON(mantibugao);
        setMinsuroGeoJSON(minsuro);
        setDamilagGeoJSON(damilag);
        setSanMiguelGeoJSON(sanMiguel);
        setAlaeGeoJSON(alae);
        setMambatanganGeoJSON(mambatangan);
        setAgusanCanyonGeoJSON(agusanCanyon);
        setMampayagGeoJSON(mampayag);
        setLindabanGeoJSON(lindaban);
        setKalugmananGeoJSON(kalugmanan);
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

  // ✅ Temporary farmer data (for demo)
  const tempFarmers = [
    {
      name: "Emma M. Racines",
      address: "Gaboc, Lingi-on, Manolo Fortich, Bukidnon",
      crop: "Corn",
      pH: 6.0,
      N: "L",
      P: "M",
      K: "L",
      lat: 8.41434677827997,
      lng: 124.87456306604953,
    },
    {
      name: "Eufracia Lague",
      address: "Zone-2 Lingi-on, Manolo Fortich, Bukidnon",
      crop: "Corn",
      pH: 5.6,
      N: "L",
      P: "L",
      K: "L",
      lat: 8.390732618284927,
      lng: 124.8727281038504,
    },
    {
      name: "Dennis Cahalin",
      address: "Zone-2 Lingi-on, Manolo Fortich, Bukidnon",
      crop: "Corn",
      pH: 5.8,
      N: "L",
      P: "L",
      K: "M",
      lat: 8.403669824905714,
      lng: 124.87770208926696,
    },
    {
      name: "Rosalita Dosayco",
      address: "Zone-2 Lingi-on, Manolo Fortich, Bukidnon",
      crop: "Corn",
      pH: 5.4,
      N: "L",
      P: "M",
      K: "H",
      lat: 8.418491935776231,
      lng: 124.89307589276603,
    },
  ];

  // ✅ Barangay select handler
  const handleBarangaySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (selectedBarangay === value || value === "") {
      setSelectedBarangay("");
      setShowBorders(false);
      if (mapRef.current) {
        mapRef.current.setView(defaultCenter, defaultZoom);
      }
    } else {
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
              <GeoJSON data={lingionGeoJSON} style={{ color: "Transparent", weight: 2 }} />
            )}
            {sangkananGeoJSON && (
              <GeoJSON data={sangkananGeoJSON} style={{ color: "Transparent", weight: 2 }} />
            )}
            {tankulanGeoJSON && (
              <GeoJSON data={tankulanGeoJSON} style={{ color: "Transparent", weight: 2 }} />
            )}
            {dalirigGeoJSON && (
              <GeoJSON data={dalirigGeoJSON} style={{ color: "Transparent", weight: 2 }} />
            )}
             {dicklumGeoJSON && (
              <GeoJSON data={dicklumGeoJSON} style={{ color: "transparent", weight: 2 }} />
            )}
            {santoNinoGeoJSON && (
              <GeoJSON data={santoNinoGeoJSON} style={{ color: "transparent", weight: 2 }} />
            )}
            {lunocanGeoJSON && (
              <GeoJSON data={lunocanGeoJSON} style={{ color: "transparent", weight: 2 }} />
            )}
            {mantibugaoGeoJSON && (
              <GeoJSON data={mantibugaoGeoJSON} style={{ color: "transparent", weight: 2 }} />
            )}
            {minsuroGeoJSON && (
              <GeoJSON data={minsuroGeoJSON} style={{ color: "transparent", weight: 2 }} />
            )}
            {damilagGeoJSON && (
              <GeoJSON data={damilagGeoJSON} style={{ color: "transparent", weight: 2 }} />
            )}
            {sanMiguelGeoJSON && (
              <GeoJSON data={sanMiguelGeoJSON} style={{ color: "transparent", weight: 2 }} />
            )}
            {alaeGeoJSON && (
              <GeoJSON data={alaeGeoJSON} style={{ color: "transparent", weight: 2 }} />
            )}
            {mambatanganGeoJSON && (
              <GeoJSON data={mambatanganGeoJSON} style={{ color: "transparent", weight: 2 }} />
            )}
            {agusanCanyonGeoJSON && (
              <GeoJSON data={agusanCanyonGeoJSON} style={{ color: "Transparent", weight: 2 }} />
            )}
            {mampayagGeoJSON && (
              <GeoJSON data={mampayagGeoJSON} style={{ color: "Transparent", weight: 2 }} />
            )}
            {lindabanGeoJSON && (
              <GeoJSON data={lindabanGeoJSON} style={{ color: "Transparent", weight: 2 }} />
            )}
            {kalugmananGeoJSON && (
              <GeoJSON data={kalugmananGeoJSON} style={{ color: "Grey", weight: 2 }} />
            )}
            

            {/* 🔹 Temporary demo farmer markers */}
            {tempFarmers.map((farmer, idx) => (
              <Marker key={idx} position={[farmer.lat, farmer.lng]} icon={cornIcon}>
                <Popup>
                  <b>{farmer.name}</b>
                  <br />
                  📍 <b>Address:</b> {farmer.address}
                  <br />
                  🌽 <b>Crop:</b> {farmer.crop}
                  <br />
                  🌡 <b>pH:</b> {farmer.pH}
                  <br />
                  🧪 <b>N:</b> {farmer.N} | <b>P:</b> {farmer.P} | <b>K:</b> {farmer.K}
                </Popup>
              </Marker>
            ))}

            {/* Farm markers from Firestore */}
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
