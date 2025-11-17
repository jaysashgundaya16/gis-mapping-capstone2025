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
  import "leaflet-draw/dist/leaflet.draw.css";
  import "leaflet-draw"; 
  import { EditControl } from "react-leaflet-draw";


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
import { crop } from "ionicons/icons";


  // ✅ Helper to get barangay name
  const getBarangayName = (feature: any): string => {
    const props = feature.properties || {};
    return props.Barangay || Object.keys(props)[0] || "Unknown";
  };


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

  // 🎨 Crop → Marker Color Map
const cropIcons: any = {
  corn: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  rice: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  coffee: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-brown.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  cassava: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  banana: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  vegetables: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-purple.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
};


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

    // selected crops filter (moved out of useEffect so checkboxes can access it)
    const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
    const toggleCrop = (crop: string) => {
      setSelectedCrops((prev) =>
        prev.includes(crop)
          ? prev.filter((c) => c !== crop) // remove (uncheck)
          : [...prev, crop] // add (check)
      );
    };

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
      console.error("Error loading geojson files:", err);
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

    setFarmMarkers(data as any[]); // now farmMarkers contains usable numbers
  });

  return () => unsub();
}, []);

  // 🆕 When a farm marker is clicked, store its border/polygon data
  const [activeFarmBorder, setActiveFarmBorder] = useState<any | null>(null);




    
    

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
  <div style={{ display: "flex", width: "100%", height: "100%" }}>
    
    

    {/* LEFT SIDEBAR */}
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
      
      {/* DA LOGO */}
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

      

      {/* SELECTS */}
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
            onChange={(e) => setSelectedBarangay(e.target.value)}
          >
            <option value="">Select Barangay</option>
            {barangays.map((bgy) => (
              <option key={bgy} value={bgy}>
                {bgy}
              </option>
            ))}
          </select>
        </div>

         <div
          style={{
            background: "#f8f8f8",
            padding: "12px",
            marginTop: "8px", // ♻ from 15px → 8px (mas duol sa taas)
            borderRadius: "8px",
            boxShadow: "inset 0 0 4px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontSize: "15px",
              marginBottom: "8px",
              fontWeight: "bold",
              textAlign: "left",
            }}
          >
            Crops
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label>
            <input
              type="checkbox"
              checked={selectedCrops.includes("corn")}
              onChange={() => toggleCrop("corn")}
            /> Corn
          </label>

          <label>
            <input
              type="checkbox"
              checked={selectedCrops.includes("rice")}
              onChange={() => toggleCrop("rice")}
            /> Rice
          </label>

          <label>
            <input
              type="checkbox"
              checked={selectedCrops.includes("cassava")}
              onChange={() => toggleCrop("cassava")}
            /> Cassava
          </label>

          <label>
            <input
              type="checkbox"
              checked={selectedCrops.includes("coffee")}
              onChange={() => toggleCrop("coffee")}
            /> Coffee
          </label>

          <label>
            <input
              type="checkbox"
              checked={selectedCrops.includes("banana")}
              onChange={() => toggleCrop("banana")}
            /> Banana
          </label>

          <label>
            <input
              type="checkbox"
              checked={selectedCrops.includes("vegetables")}
              onChange={() => toggleCrop("vegetables")}
            /> Vegetables
          </label>

          </div>
        </div>

    

      </div>
    </div>

    



  


    {/* MAP */}
    <div style={{ flex: 1, position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            height: "calc(100vh - 80px)",
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

      {/* MAP LEGEND OVERLAY */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            background: "white",
            padding: "10px 12px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            fontSize: "14px",
            lineHeight: "20px",
          }}
        >
          <b>Legend</b>
          <div><span style={{ color: "yellow", fontWeight: "bold" }}>■</span> Corn</div>
          <div><span style={{ color: "blue", fontWeight: "bold" }}>■</span> Rice</div>
          <div><span style={{ color: "black", fontWeight: "bold" }}>■</span> Cassava</div>
          <div><span style={{ color: "brown", fontWeight: "bold" }}>■</span> Coffee</div>
          <div><span style={{ color: "orange", fontWeight: "bold" }}>■</span> Banana</div>
          <div><span style={{ color: "purple", fontWeight: "bold" }}>■</span> Vegetables</div>
        </div>


      

      

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

              

              {/* 🆕 SHOW FARM BORDER WHEN MARKER CLICKED */}
              {activeFarmBorder && activeFarmBorder.border && (
                <GeoJSON
                  data={{
                    type: "Feature",
                    geometry: {
                      type: "Polygon",
                      coordinates: [
                        activeFarmBorder.border.map((p: any) => [p.lng, p.lat])
                      ],
                    },
                    properties: {},
                  } as any}
                  style={{
                    color:
                      activeFarmBorder.crop.toLowerCase() === "corn"
                        ? "yellow"
                        : "blue", // default color if not corn
                    weight: 3,
                    fillOpacity: 0.1,
                  }}
                />
              )}

              
            
              

              
              {/* ✅ Farm markers from Firestore (farms + farmersProfile combined) */}
              {farmMarkers.map((farm, idx) => (
                <Marker
                  key={idx}
                  position={[farm.lat, farm.lng]}
                 icon={
                      selectedCrops.length === 0
                        ? greenIcon // nothing checked
                        : selectedCrops.includes((farm.cropType || farm.crop || "").toLowerCase())
                          ? cropIcons[(farm.cropType || farm.crop || "").toLowerCase()] || greenIcon
                          : greenIcon // if crop not selected → stay green
}

                  eventHandlers={{
                    click: () => {
                      if (internalMapRef.current) {
                        internalMapRef.current.setView([farm.lat, farm.lng], 17); // 🔍 zoom in
                      }

                      // If farm has polygon data, show it
                      if (farm.farmArea) {
                        setActiveFarmBorder({
                          crop: farm.cropType || farm.crop || "",
                          border: farm.farmArea, // must be array of {lat,lng}
                        });
                      } else {
                        setActiveFarmBorder(null);
                      }
                    },
                  }}
                >

                  <Popup>
                    <b>Farmer:</b> {farm.farmerName}<br />
                    <b>Crop:</b> {farm.cropType || farm.crop}<br />
                    <b>Barangay:</b> {farm.barangay}
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

