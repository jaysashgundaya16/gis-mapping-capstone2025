import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonModal,
  IonInput,
  IonLabel,
  IonItem,
  IonLoading,
  IonSearchbar,
} from "@ionic/react";
import {
  menuOutline,
  createOutline,
  trashOutline,
  addOutline,
  documentOutline,
  archiveOutline,
} from "ionicons/icons";
import SideMenu from "../components/SideMenu";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  setDoc,
} from "firebase/firestore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import L from "leaflet";

const cropIcons: any = {
  corn: L.icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    iconSize: [32, 32]
  }),
  rice: L.icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [32, 32]
  }),
  banana: L.icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [32, 32]
  }),
};

const defaultIcon = L.icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32]
});


// 🧭 Custom marker icons
const currentLocationIcon = L.icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

const farmerIcon = L.icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

interface SoilTest {
  id: string;
  farmerName: string;
  siteOfFarm: string;
  area: string;
  crop: string;
  ph: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  lime: string;
  nVal: string;
  pVal: string;
  kVal: string;
  fertilizer1: string;
  fertilizer2: string;
  fertilizer3: string;
  lat?: string;
  lng?: string;

}

const FarmersProfile: React.FC = () => {
  const [municipality, setMunicipality] = useState("All");
  const [selectedCrop, setSelectedCrop] = useState("All"); // ✅ New state for crop dropdown
  const [records, setRecords] = useState<SoilTest[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<SoilTest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<SoilTest>>({});

  // Refs for Leaflet map and marker layer group
  const mapRef = React.useRef<any>(null);
  const markersRef = React.useRef<any>(null);
  const [editingRecord, setEditingRecord] = useState<SoilTest | null>(null);

  const [selectedCrops, setSelectedCrops] = useState<string[]>([
  "corn",
  "rice",
  "banana"
]);

const toggleCrop = (crop: string) => {
  setSelectedCrops((prev) =>
    prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]
  );
};

  // Fetch records
  useEffect(() => {
    const q = query(collection(db, "soilTests"), orderBy("farmerName"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: SoilTest[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<SoilTest, "id">),
      }));
      setRecords(data);
      setFilteredRecords(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🗺️ Render markers for farmers on the map
useEffect(() => {
  if (!mapRef.current) return;

  // Create the map once if not initialized
  if (!mapRef.current._leaflet_id) {
    mapRef.current = L.map("map", {
      center: [8.3575, 124.8645], // Center of Manolo Fortich
      zoom: 12,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);

    markersRef.current = L.layerGroup().addTo(mapRef.current);
  }

  // Clear existing markers
  markersRef.current.clearLayers();

  // Add all farmer markers (green)
  filteredRecords
  .filter(rec =>
    selectedCrops.includes(rec.crop?.toLowerCase().trim() || "")
  )
  .forEach((rec) => {
    if (rec.lat && rec.lng) {
      const cropKey = rec.crop?.toLowerCase().trim();
      const icon = cropIcons[cropKey] || defaultIcon;

      const marker = L.marker(
        [parseFloat(rec.lat), parseFloat(rec.lng)],
        { icon: icon }
      ).addTo(markersRef.current);

      marker.bindPopup(
        `<b>${rec.farmerName}</b><br>${rec.crop}<br>${rec.siteOfFarm}`
      );
    }
  });


}, [filteredRecords]);


  // Filter search
  useEffect(() => {
    const filtered = records.filter((rec) =>
      rec.farmerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecords(filtered);
  }, [searchTerm, records]);  

// ✅ Barangay + Crop Filtering Logic (supports partial match and shows all by default)
useEffect(() => {
  const filtered = records.filter((rec) => {
    const farm = rec.siteOfFarm?.toLowerCase().trim() || "";
    const crop = rec.crop?.toLowerCase().trim() || "";
    const selectedBarangay = municipality?.toLowerCase().trim() || "";
    const selectedCropName = selectedCrop?.toLowerCase().trim() || "";

    const matchesBarangay =
      selectedBarangay === "all" || farm.includes(selectedBarangay);
    const matchesCrop =
      selectedCropName === "all" || crop.includes(selectedCropName);

    return matchesBarangay && matchesCrop;
  });

  // ✅ If no filters selected, show all records
  if (!municipality && !selectedCrop) {
    setFilteredRecords(records);
  } else {
    setFilteredRecords(filtered);
  }
}, [municipality, selectedCrop, records]);




// Add/Edit
const openAdd = () => {
  setForm({});
  setEditingRecord(null);
  setShowModal(true);
};

const openEdit = (record: SoilTest) => {
  setForm(record);
  setEditingRecord(record);
  setShowModal(true);
};

// Save
const handleSave = async () => {
  if (!form.farmerName || !form.siteOfFarm || !form.area || !form.crop) {
    alert("Please fill in all required fields.");
    return;
  }
  try {
    if (editingRecord) {
      await updateDoc(doc(db, "soilTests", editingRecord.id), { ...form });
    } else {
      await addDoc(collection(db, "soilTests"), {
        farmerName: form.farmerName,
        siteOfFarm: form.siteOfFarm,
        area: form.area,
        crop: form.crop,
        lat: form.lat || "",
        lng: form.lng || "",
        ph: form.ph || "",
        nitrogen: form.nitrogen || "",
        phosphorus: form.phosphorus || "",
        potassium: form.potassium || "",
        lime: form.lime || "",
        nVal: form.nVal || "",
        pVal: form.pVal || "",
        kVal: form.kVal || "",
        fertilizer1: form.fertilizer1 || "",
        fertilizer2: form.fertilizer2 || "",
        fertilizer3: form.fertilizer3 || "",
      });
    }
    // close modal and reset form after successful save
    setShowModal(false);
    setForm({});
    setEditingRecord(null);
  } catch (err) {
    console.error("Error saving record:", err);
    alert("Error saving record.");
  }
};

const handlePermanentDelete = async (id: string) => {
  const archiveRef = doc(db, "archives", id);
  await deleteDoc(archiveRef);
};


const handleRetrieve = async (id: string, data: any) => {
  const mainRef = doc(db, "soilTests", id);
  const archiveRef = doc(db, "archives", id);

  await setDoc(mainRef, {
    ...data,
    restoredAt: new Date(),
  });

  await deleteDoc(archiveRef);
};


// 🔹 Use my current location
const handleUseMyLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported on this device.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;

      // Update the form fields with current location
      setForm((prev) => ({
        ...prev,
        lat: latitude.toFixed(6),
        lng: longitude.toFixed(6),
      }));

      // Add marker on the map
      if (mapRef.current) {
        // ensure a LayerGroup for markers exists; create it if missing
        if (!markersRef.current && L && typeof L.layerGroup === "function") {
          try {
            markersRef.current = L.layerGroup().addTo(mapRef.current);
          } catch (e) {
            // fallback - if adding layerGroup fails, leave markersRef null
            console.warn("Failed to create marker layer group:", e);
          }
        }

        // clear old markers if any
        if (markersRef.current && typeof markersRef.current.clearLayers === "function") {
          markersRef.current.clearLayers();
        }

        // create a marker at the current position and add to layer group if available
        try {
          if (markersRef.current && typeof markersRef.current.addLayer === "function") {
            const marker = L.marker([latitude, longitude], { icon: currentLocationIcon }).addTo(markersRef.current!);
            marker.bindPopup(`<b>Current Location</b>`).openPopup();
          } else {
            // fallback: add marker directly to the map
            const marker = L.marker([latitude, longitude]).addTo(mapRef.current);
            marker.bindPopup(`<b>Current Location</b>`).openPopup();
          }
        } catch (e) {
          console.error("Failed to add marker:", e);
        }

        // center and zoom the map to your location
        try {
          if (typeof mapRef.current.setView === "function") {
            mapRef.current.setView([latitude, longitude], 16);
          }
        } catch (e) {
          console.warn("Failed to set map view:", e);
        }
      }
    },
    (err) => {
      console.error("Location access denied:", err);
      alert("Please allow location access to use this feature.");
    }
  );
};



  // Delete
  const handleArchive = async (id: string, data: any) => {
  const archiveRef = doc(db, "archives", id);
  const mainRef = doc(db, "soilTests", id);

  await setDoc(archiveRef, {
    ...data,
    archivedAt: new Date(),
  });

  await deleteDoc(mainRef);
};


  

  // Generate PDF
  const generatePdfForRecord = async (rec: SoilTest) => {
    try {
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.width = "794px";
      container.style.background = "white";
      container.style.padding = "20px";
      container.style.fontFamily = "Arial, sans-serif";
      container.style.fontSize = "12px";

      container.innerHTML = `
        <div style="text-align:center; margin-bottom:8px;">
          <div style="font-weight:700; font-size:16px;">Republic of the Philippines</div>
          <div style="font-weight:700; font-size:20px;">DEPARTMENT OF AGRICULTURE</div>
          <div style="font-size:12px;">Region No. 10</div>
        </div>

        <div style="border-top:2px solid #000; padding-top:8px; margin-bottom:7px;">
          <div style="display:flex; justify-content:space-between;">
            <div><strong>Name of Farmer:</strong> ${rec.farmerName || ""}</div>
            <div><strong>Sample No.:</strong></div>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <div><strong>Site of Farm:</strong> ${rec.siteOfFarm || ""}</div>
            <div><strong>Topo:</strong> PLAIN</div>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <div><strong>Barangay / Area:</strong> ${rec.area || ""}</div>
            <div><strong>Area (ha):</strong> ${rec.area || ""}</div>
          </div>
        </div>

        <div style="display:flex; border:1px solid #000; margin-bottom:8px;">
          <div style="flex:1; border-right:1px solid #000; padding:8px;">
            <div style="font-weight:700;">SOIL TEST KIT DATA</div>
            <div><strong>pH:</strong> ${rec.ph || ""}</div>
            <div><strong>Nitrogen:</strong> ${rec.nitrogen || ""}</div>
            <div><strong>Phosphorus:</strong> ${rec.phosphorus || ""}</div>
            <div><strong>Potassium:</strong> ${rec.potassium || ""}</div>
          </div>
          <div style="flex:1; padding:8px;">
            <div style="font-weight:700; text-align:center;">NUTRIENT REQUIREMENT</div>
            <div style="display:flex; justify-content:space-between;"><div><strong>Crop:</strong></div><div>${rec.crop || ""}</div></div>
            <div style="display:flex; justify-content:space-between;"><div><strong>Lime:</strong></div><div>${rec.lime || ""}</div></div>
            <div style="display:flex; justify-content:space-between;"><div><strong>N (kg/ha):</strong></div><div>${rec.nVal || ""}</div></div>
            <div style="display:flex; justify-content:space-between;"><div><strong>P (kg/ha):</strong></div><div>${rec.pVal || ""}</div></div>
            <div style="display:flex; justify-content:space-between;"><div><strong>K (kg/ha):</strong></div><div>${rec.kVal || ""}</div></div>
          </div>
        </div>

        <div style="margin-top:10px; border-top:1px solid #000; padding-top:10px;">
          <div style="font-weight:700; text-align:center;">FERTILIZER RECOMMENDATION</div>
          <div style="text-align:left; display:inline-block; margin-top:5px; margin-bottom:25px;">
            <div>${rec.fertilizer1 || ""}</div>
            <div>${rec.fertilizer2 || ""}</div>
            <div>${rec.fertilizer3 || ""}</div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:40px; font-size:11px;">
            <div>
              Legend: L - Low &nbsp;&nbsp; M - Medium &nbsp;&nbsp; H - High &nbsp;&nbsp; S - Sufficient &nbsp;&nbsp; D - Deficient
            </div>
            <div style="text-align:right; margin-top:25px;">
              <div style="border-top:1px solid #000; width:200px; margin-left:auto;"></div>
              (Personnel In-charge)
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(container);

      const canvas = await html2canvas(container, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 10;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 5, 5, imgWidth, imgHeight);
      pdf.save(`${rec.farmerName?.replace(/\s+/g, "_") || "soil_report"}.pdf`);

      document.body.removeChild(container);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to generate PDF.");
    }
  };

  return (
    <>
      <SideMenu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar color="light">
            <IonButtons slot="start">
              <IonMenuButton autoHide={false}>
                <IonIcon icon={menuOutline} />
              </IonMenuButton>
            </IonButtons>
            <IonTitle style={{ color: "#000000ff" }}>
              Manolo Fortich Farmer's Information
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonLoading
            isOpen={loading}
            message="Loading soil test records..."
            spinner="circles"
          />

          {!loading && (
            <>
              <div
                  style={{
                    backgroundImage: `url('https://static.vecteezy.com/system/resources/thumbnails/046/889/228/small_2x/close-up-of-soil-texture-layers-photo.jpg?fbclid=IwY2xjawODdEpleHRuA2FlbQIxMABicmlkETF5QVRNSHdGbEh1ZUhvMTFWc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHqcih2Yylf5d80ure7WLsMpKsoBqqS5yVPHuxonE60ifOifTcUxUAbt3pQRy_aem_Gbz8csNuU0pagw3bZEHo_w')`, // ✅ your online bg URL
                    backgroundSize: "cover",   // ensures the image covers the area without blur
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    padding: "70px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "relative",
                    borderRadius: "1px",
                    opacity: 0.90, // ✅ adjust this for transparency
                  }}
                >
                  {/* RIGHT SIDE LOGO - FIXED & DOES NOT BREAK LAYOUT */}
                  <div
                    style={{
                      position: "absolute",
                      right: "100px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 9999
                    }}
                  >
                    <img
                      src="https://scontent.fcgy2-1.fna.fbcdn.net/v/t1.15752-9/582228958_3842362389391004_4052308621934849037_n.png?_nc_cat=107&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeETdj3afSN-gIgA0ZZ3m1Dh3IbeP_XB5pTcht4_9cHmlBP4BYRu9qUv2iTZ9yA8frPGmpx7UWzJO-V6fUcJpQpY&_nc_ohc=gZKSffDOZ5UQ7kNvwFq7EuU&_nc_oc=AdlKdun9RDP80x8wMpSqSjv-cRpsCflsP2dCoJ-qF9fn4DGqBNANHCRD9-czoqde-4A&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fcgy2-1.fna&oh=03_Q7cD3wF5yGssMiK8MUptvcnXHeGwAhSUDzCWGQI4Xs2ravy_uQ&oe=693E0A9A"
                      alt=""
                      style={{
                        height: "160px",
                        width: "160px",   // <<--- CHANGE LOGO WIDTH HERE
                        opacity: 0.85,
                        objectFit: "contain"
                      }}
                    />
                  </div>
                <IonGrid>  
                  <IonRow>
                    <>
                      <style>{`
                        .styled-select {
                          --color: white;
                          --placeholder-color: white;
                          --padding-start: 12px;
                          --padding-end: 12px;
                          --background: "rgba(255, 255, 255, 0.15)";
                          --border-radius: 12px;
                          --inner-padding-top: 10px;
                          --inner-padding-bottom: 10px;
                          transition: 0.25s ease-in-out;
                          
                        }

                        .styled-select:hover {
                          --background: rgba(255, 255, 255, 0.01);
                          transform: scale(1.03);
                          cursor: pointer;
                        }

                        .styled-select:active {
                          --background: rgba(255, 255, 255, 0.35);
                          transform: scale(0.98);
                        }

                        ion-select.styled-select::part(text) {
                          color: white !important;
                        }

                        ion-alert .alert-radio-label {
                          color: white !important;
                        }

                        ion-alert {
                          --background: #1d1d1d !important;
                        }
                      `}</style>

                      {/* YOUR BARANGAY SELECT DROPDOWN */}
                      <IonCol size="2">
                        <h3 style={{ color: "white" }}>Select Barangay</h3>

                        <IonSelect
                          value={municipality}
                          onIonChange={(e) => setMunicipality(e.detail.value)}
                          className="styled-select"
                        >
                          <IonSelectOption value="All">All Barangays</IonSelectOption>
                          <IonSelectOption value="Agusan Canyon">Agusan Canyon</IonSelectOption>
                          <IonSelectOption value="Alae">Alae</IonSelectOption>
                          <IonSelectOption value="Dahilayan">Dahilayan</IonSelectOption>
                          <IonSelectOption value="Dalirig">Dalirig</IonSelectOption>
                          <IonSelectOption value="Damilag">Damilag</IonSelectOption>
                          <IonSelectOption value="Diclum">Diclum</IonSelectOption>
                          <IonSelectOption value="Guilang-guilang">Guilang-guilang</IonSelectOption>
                          <IonSelectOption value="Kalugmanan">Kalugmanan</IonSelectOption>
                          <IonSelectOption value="Lindaban">Lindaban</IonSelectOption>
                          <IonSelectOption value="Lingi-on">Lingi-on</IonSelectOption>
                          <IonSelectOption value="Lunocan">Lunocan</IonSelectOption>
                          <IonSelectOption value="Maluko">Maluko</IonSelectOption>
                          <IonSelectOption value="Mambatangan">Mambatangan</IonSelectOption>
                          <IonSelectOption value="Mampayag">Mampayag</IonSelectOption>
                          <IonSelectOption value="Minsuro">Minsuro</IonSelectOption>
                          <IonSelectOption value="Mantibugao">Mantibugao</IonSelectOption>
                          <IonSelectOption value="Tankulan">Tankulan</IonSelectOption>
                          <IonSelectOption value="San Miguel">San Miguel</IonSelectOption>
                          <IonSelectOption value="Sankanan">Sankanan</IonSelectOption>
                          <IonSelectOption value="Santiago">Santiago</IonSelectOption>
                          <IonSelectOption value="Santo Niño">Santo Niño</IonSelectOption>
                          <IonSelectOption value="Ticala">Ticala</IonSelectOption>
                        </IonSelect>
                      </IonCol>
                    </>

                          
                    {/* ✅ New Crop Dropdown beside Barangay */}
                    <IonCol size="2">
                        
                      <h3 style={{ color: "white" }}>Select Crop</h3>
                      <IonSelect
                        value={selectedCrop} style={{ color: "white" }}
                        onIonChange={(e) => setSelectedCrop(e.detail.value)}
                      >
                        <IonSelectOption value="All">All Crops</IonSelectOption>
                        <IonSelectOption value="Corn">Corn</IonSelectOption>
                        <IonSelectOption value="Rice">Rice</IonSelectOption>
                        <IonSelectOption value="Sugarcane">Sugarcane</IonSelectOption>
                        <IonSelectOption value="Banana">Banana</IonSelectOption>
                        <IonSelectOption value="Pineapple">Pineapple</IonSelectOption>
                        <IonSelectOption value="Coconut">Coconut</IonSelectOption>
                        <IonSelectOption value="Vegetables">Vegetables</IonSelectOption>
                        <IonSelectOption value="Root Crops">Root Crops</IonSelectOption>
                      </IonSelect>
                    </IonCol>
                  </IonRow>
                </IonGrid>

                
              </div>

              {/* ✅ rest of your table, modal, etc. remain unchanged */}
              {/* --------------------- TABLE --------------------- */}
              <IonGrid>
                <IonRow className="ion-align-items-center ion-padding-horizontal ion-margin-top">
                  <IonCol size="8">
                    <IonSearchbar
                      value={searchTerm}
                      onIonInput={(e) => setSearchTerm(e.detail.value!)}
                      placeholder="Search by Farmer Name..."
                    />
                  </IonCol>
                  <IonCol size="4" className="ion-text-right">
                    <IonButton color="success" onClick={openAdd}>
                      <IonIcon icon={addOutline} slot="start" />
                      Add Record
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>

              <IonGrid>
                <IonRow
                  style={{
                    background: "white",
                    fontWeight: "bold",
                    borderBottom: "2px solid #07371A",
                  }}
                >
                  <IonCol size="1">#</IonCol>
                  <IonCol>Farmer Name</IonCol>
                  <IonCol>Site of Farm</IonCol>
                  <IonCol>Area</IonCol>
                  <IonCol>Crop</IonCol>
                  <IonCol>Latitude</IonCol>
                  <IonCol>Longitude</IonCol>
                  <IonCol>pH</IonCol>
                  <IonCol>N</IonCol>
                  <IonCol>P</IonCol>
                  <IonCol>K</IonCol>
                  <IonCol>Lime</IonCol>
                  <IonCol>N (kg)</IonCol>
                  <IonCol>P (kg)</IonCol>
                  <IonCol size="0.6">K (kg)</IonCol>
                  
                  <IonCol style={{ textAlign: "center" }} >Fertilizer Recommendation</IonCol>
                  
                  <IonCol size="1."></IonCol>
                </IonRow>

                {filteredRecords.length === 0 ? (
                  <IonRow>
                    <IonCol
                      size="12"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "gray",
                      }}
                    >
                      No matching records found.
                    </IonCol>
                  </IonRow>
                ) : (
                  filteredRecords.map((rec, index) => (
                    <IonRow
                      key={rec.id}
                      style={{
                        borderBottom: "1px solid #ccc",
                        background: index % 2 === 0 ? "white" : "#f9f9f9",
                        color: "black",
                      }}
                    >
                      <IonCol size="1">{index + 1}</IonCol>
                      <IonCol>{rec.farmerName}</IonCol>
                      <IonCol>{rec.siteOfFarm}</IonCol>
                      <IonCol>{rec.area}</IonCol>
                      <IonCol>{rec.crop}</IonCol>
                      <IonCol>{rec.lat}</IonCol>
                      <IonCol>{rec.lng}</IonCol>
                      <IonCol>{rec.ph}</IonCol>
                      <IonCol>{rec.nitrogen}</IonCol>
                      <IonCol>{rec.phosphorus}</IonCol>
                      <IonCol>{rec.potassium}</IonCol>
                      <IonCol>{rec.lime}</IonCol>
                      <IonCol>{rec.nVal}</IonCol>
                      <IonCol>{rec.pVal}</IonCol>
                      <IonCol>{rec.kVal}</IonCol>
                      <IonCol>{rec.fertilizer1}</IonCol>
                      <IonCol>{rec.fertilizer2}</IonCol>
                      <IonCol>{rec.fertilizer3}</IonCol>
                      <IonCol size="1.1.8">
                        <IonButton
                          size="small"
                          color="primary"
                          onClick={() => openEdit(rec)}
                        >
                          <IonIcon icon={createOutline} />
                        </IonButton>
                        <IonButton
                          size="small"
                          color="tertiary"  // you can keep "danger" or change to "tertiary" / "medium" if you like
                          onClick={() => handleArchive(rec.id, rec)}
                        >
                          <IonIcon icon={archiveOutline} />

                          <IonIcon icon={trashOutline} />
                        </IonButton>
                        <IonButton
                          size="small"
                          color="tertiary"
                          onClick={() => generatePdfForRecord(rec)}
                        >
                          <IonIcon icon={documentOutline} />
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  ))
                )}
              </IonGrid>
            </>
          )}

          {/* Modal */}
          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <IonHeader>
              <IonToolbar color="light">
                <IonTitle style={{ color: "#07371A" }}>
                  {editingRecord
                    ? "Edit Soil Test Record"
                    : "Add Soil Test Record"}
                </IonTitle>
              </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
              {[
                { label: "Name of Farmer", key: "farmerName" },
                { label: "Site of Farm", key: "siteOfFarm" },
                { label: "Area (ha)", key: "area" },
                { label: "Crop", key: "crop" },
                { label: "Latitude", key: "lat" },
                { label: "Longitude", key: "lng" },
                { label: "pH", key: "ph" },
                { label: "Lime (tons/ha)", key: "lime" },
                { label: "N (kg/ha/kg/plant)", key: "nVal" },
                { label: "P (kg/ha/kg/plant)", key: "pVal" },
                { label: "K (kg/ha/kg/plant)", key: "kVal" },
                { label: "Fertilizer Recommendation 1", key: "fertilizer1" },
                { label: "Fertilizer Recommendation 2", key: "fertilizer2" },
                { label: "Fertilizer Recommendation 3", key: "fertilizer3" },
              ].map((field) => (
                <IonItem key={field.key}>
                  <IonLabel position="stacked">{field.label}</IonLabel>
                  <IonInput
                    value={(form as any)[field.key]}
                    onIonChange={(e) =>
                      setForm({ ...form, [field.key]: e.detail.value! })
                    }
                  />
                </IonItem>
              ))}

              

              {["nitrogen", "phosphorus", "potassium"].map((nutrient) => (
                <IonItem key={nutrient}>
                  <IonLabel position="stacked">
                    {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
                  </IonLabel>
                  <IonSelect
                    value={(form as any)[nutrient]}
                    onIonChange={(e) =>
                      setForm({ ...form, [nutrient]: e.detail.value })
                    }
                  >
                    <IonSelectOption value="L">Low</IonSelectOption>
                    <IonSelectOption value="M">Medium</IonSelectOption>
                    <IonSelectOption value="H">High</IonSelectOption>
                  </IonSelect>
                </IonItem>
              ))}


              <IonButton expand="block" color="medium" onClick={handleUseMyLocation}>
                Use My Current Location
              </IonButton>
              <IonButton
                expand="block"
                color="success"
                onClick={handleSave}
                className="ion-margin-top"
              >
                Save
              </IonButton>
              <IonButton
                expand="block"
                color="medium"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </IonButton>
            </IonContent>
          </IonModal>
        </IonContent>
      </IonPage>
    </>
  );
};

export default FarmersProfile;

