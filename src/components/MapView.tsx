import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
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

// Map click handler component
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



// ForwardRef to expose setView
const MapView = forwardRef<any, MapViewProps>(({ markers = [], clickToSet = false, onMapClick }, ref) => {
  const internalMapRef = useRef<L.Map | null>(null);

  // Expose small API to parent (Dashboard)
  useImperativeHandle(ref, () => ({
    setView: (latlng: [number, number], zoom = 15) => {
      if (internalMapRef.current) { 
        internalMapRef.current.setView(latlng, zoom);
      }
    },
    // you can expose more methods here if needed later
  }));

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
        const [
          main,
          lingion,
          sangkanan,
          tankulan,
          dalirig,
          dicklum,
          santoNino,
          lunocan,
          mantibugao,
          minsuro,
          damilag,
          sanMiguel,
          alae,
          mambatangan,
          agusanCanyon,
          mampayag,
          lindaban,
          kalugmanan,
        ] = await Promise.all([
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
  const unsub = onSnapshot(collection(db, "soilTests"), (snapshot) => {
    const data = snapshot.docs
      .map((doc) => {
        const docData = doc.data();
        if (docData.lat && docData.lng) {
          return {
            id: doc.id,
            ...docData,
            lat: Number(docData.lat), // convert string to number
            lng: Number(docData.lng),
          };
        }
        return null;
      })
      .filter(Boolean); // remove nulls

    console.log("✅ Farm markers loaded:", data); // ✅ Added console log

    setFarmMarkers(data); // now farmMarkers contains usable numbers
  });

  return () => unsub();
}, []);



  // ✅ Temporary farmer data (for demo)
  

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
    if (internalMapRef.current && filteredGeoJSON && filteredGeoJSON.features.length > 0) {
      const layer = L.geoJSON(filteredGeoJSON);
      internalMapRef.current.fitBounds(layer.getBounds(), { padding: [20, 20], maxZoom: 13 });
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
            src="https://scontent.fdvo1-2.fna.fbcdn.net/v/t1.15752-9/435128497_1021547552609800_2173027098169736129_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeHhOeYdZEKOEMHr2lLY-IrLL2UmIj11gJsvZSYiPXWAm0nd9-DDMEkYmq42eITAQXGZztExuM3RCUlcUWvGQSUl&_nc_ohc=MG2nOTKssN4Q7kNvwGLYZtZ&_nc_oc=Admuy02aRGPgHW_PWZHtfVxE8dK0CWMx-KUqZo4N5wFDan6-o1XhjUbCCi4W3WI37xk&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fdvo1-2.fna&oh=03_Q7cD3wGOJP_BEQ1-3M7rSXOCcdzW8o4dvgLIXUviwadaOwvnDw&oe=693DB580"
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
              ref={internalMapRef} 
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
              <GeoJSON data={kalugmananGeoJSON} style={{ color: "Black", weight: 2 }} />
            )}

            {/* 🔹 Temporary demo farmer markers */}
            

            
            {/* ✅ Farm markers from Firestore (farms + farmersProfile combined) */}
            {farmMarkers.map((farm, idx) => (
              <Marker
                key={idx}
                position={[farm.lat, farm.lng]}  // ✅ use lat/lng
                icon={greenIcon}
              >
                <Popup>
                  <b>Farmer:</b> {farm.farmerName || farm.name || "N/A"} <br />
                  <b>Crop:</b> {farm.cropType || farm.crop || "N/A"} <br />
                  <b>Barangay:</b> {farm.barangay || "Unknown"} <br />
                  {farm.pH && (
                    <>
                      🌡 <b>pH:</b> {farm.pH} <br />
                      🧪 <b>N:</b> {farm.N} | <b>P:</b> {farm.P} | <b>K:</b> {farm.K}
                    </>
                  )}
                </Popup>
              </Marker>
            ))}

          </MapContainer>
        )}
      </div>
    </div>
  );
});

export default MapView;
