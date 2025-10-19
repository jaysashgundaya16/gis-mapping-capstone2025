import React, { useEffect, useState } from "react";
import MapView from "../components/MapView";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import {
  menuOutline,
  closeOutline,
  chevronDownOutline,
  mapOutline,
} from "ionicons/icons";
import SideMenu from "../components/SideMenu";
import "./Dashboard.css";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { useIonRouter, useIonViewWillEnter } from "@ionic/react";

type SoilRecord = {
  id?: string;
  cropName?: string;
  nitrogen?: string;
  phosphorus?: string;
  potassium?: string;
  ph?: number;
  moisture?: number;
  lat: number;
  lng: number;
  timestamp?: any;
};

const Dashboard: React.FC = () => {
  const router = useIonRouter();
  const [showForm, setShowForm] = useState(false);
  const [soilRecords, setSoilRecords] = useState<SoilRecord[]>([]);
  const [cropName, setCropName] = useState("");
  const [lat, setLat] = useState(8.3695);
  const [lng, setLng] = useState(124.8643);
  const [nitrogen, setNitrogen] = useState("Medium");
  const [phosphorus, setPhosphorus] = useState("Medium");
  const [potassium, setPotassium] = useState("Medium");
  const [phVal, setPhVal] = useState<number | undefined>(6.5);
  const [moisture, setMoisture] = useState<number | undefined>(50);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "soilData"), (snap) => {
      const data: SoilRecord[] = [];
      snap.forEach((doc) =>
        data.push({ id: doc.id, ...(doc.data() as SoilRecord) })
      );
      setSoilRecords(data);
    });
    return () => unsub();
  }, []);

  useIonViewWillEnter(() => {
    const loadRecord = async () => {
      const url = new URL(window.location.href);
      const recordId = url.searchParams.get("id");

      if (recordId) {
        setEditingId(recordId);
        setShowForm(true);
        const docRef = doc(db, "soilData", recordId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as SoilRecord;
          setCropName(data.cropName || "");
          setLat(data.lat);
          setLng(data.lng);
          setNitrogen(data.nitrogen || "Medium");
          setPhosphorus(data.phosphorus || "Medium");
          setPotassium(data.potassium || "Medium");
          setPhVal(data.ph);
          setMoisture(data.moisture);
        }
      }
    };
    void loadRecord();
  });

  const handleMapClick = ({ lat, lng }: { lat: number; lng: number }) => {
    setLat(lat);
    setLng(lng);
  };

  const saveSoilData = async () => {
    const payload = {
      cropName: cropName || "Unknown",
      nitrogen,
      phosphorus,
      potassium,
      ph: phVal ?? null,
      moisture: moisture ?? null,
      lat,
      lng,
      timestamp: serverTimestamp(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "soilData", editingId), payload);
        alert("Soil data updated successfully!");
      } else {
        await addDoc(collection(db, "soilData"), payload);
        alert("Soil data saved successfully!");
      }
      resetForm();
      router.push("/soil-data-dashboard", "root");
    } catch (error) {
      console.error(error);
      alert("Error saving soil data.");
    }
  };

  const resetForm = () => {
    setCropName("");
    setNitrogen("Medium");
    setPhosphorus("Medium");
    setPotassium("Medium");
    setPhVal(6.5);
    setMoisture(50);
    setEditingId(null);
  };

  return (
    <>
      <SideMenu />
      <IonPage id="main-content">
        <IonHeader translucent>
          <IonToolbar className="header-gradient">
            <IonButtons slot="start">
              <IonMenuButton autoHide={false}>
                <IonIcon icon={menuOutline} />
              </IonMenuButton>
            </IonButtons>
            <IonTitle className="dashboard-center-title">
              🌾 Soil Nutrient Crop Profiling (Admin)
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen className="dashboard-bg">
          <div className="map-header-bar">
            <span>
              <IonIcon icon={mapOutline} /> Map View
            </span>
            <IonButton
              fill="clear"
              className={`soil-data-btn ${showForm ? "active" : ""}`}
              onClick={() => setShowForm(!showForm)}
            >
              🧪 <strong>Soil Data Management</strong>
              <IonIcon icon={chevronDownOutline} slot="end" />
            </IonButton>
          </div>

          <div style={{ height: "80vh", width: "100%" }}>
            <MapView
              markers={soilRecords.map((r) => ({
                ...r,
                latitude: r.lat,
                longitude: r.lng,
              }))}
              clickToSet
              onMapClick={handleMapClick}
            />
          </div>

          {/* Floating Soil Data Form */}
          <div
            className={`floating-soil-box ${
              showForm ? "slide-in" : "slide-out"
            }`}
          >
            <div className="soil-box-header">
              <strong>🧪 {editingId ? "Edit Soil Data" : "Add Soil Data"}</strong>
              <IonButton fill="clear" onClick={() => setShowForm(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </div>

            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  <IonItem>
                    <IonLabel position="stacked">Crop Name</IonLabel>
                    <IonInput
                      value={cropName}
                      onIonChange={(e) => setCropName(e.detail.value!)}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol size="6">
                  <IonItem>
                    <IonLabel position="stacked">Latitude</IonLabel>
                    <IonInput
                      type="number"
                      value={lat}
                      onIonChange={(e) =>
                        setLat(parseFloat(e.detail.value as string))
                      }
                    />
                  </IonItem>
                </IonCol>
                <IonCol size="6">
                  <IonItem>
                    <IonLabel position="stacked">Longitude</IonLabel>
                    <IonInput
                      type="number"
                      value={lng}
                      onIonChange={(e) =>
                        setLng(parseFloat(e.detail.value as string))
                      }
                    />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol size="6">
                  <IonItem>
                    <IonLabel position="stacked">Nitrogen</IonLabel>
                    <IonSelect
                      value={nitrogen}
                      onIonChange={(e) => setNitrogen(e.detail.value)}
                    >
                      <IonSelectOption value="Low">Low</IonSelectOption>
                      <IonSelectOption value="Medium">Medium</IonSelectOption>
                      <IonSelectOption value="High">High</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>
                <IonCol size="6">
                  <IonItem>
                    <IonLabel position="stacked">Phosphorus</IonLabel>
                    <IonSelect
                      value={phosphorus}
                      onIonChange={(e) => setPhosphorus(e.detail.value)}
                    >
                      <IonSelectOption value="Low">Low</IonSelectOption>
                      <IonSelectOption value="Medium">Medium</IonSelectOption>
                      <IonSelectOption value="High">High</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol size="6">
                  <IonItem>
                    <IonLabel position="stacked">Potassium</IonLabel>
                    <IonSelect
                      value={potassium}
                      onIonChange={(e) => setPotassium(e.detail.value)}
                    >
                      <IonSelectOption value="Low">Low</IonSelectOption>
                      <IonSelectOption value="Medium">Medium</IonSelectOption>
                      <IonSelectOption value="High">High</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>
                <IonCol size="6">
                  <IonItem>
                    <IonLabel position="stacked">pH</IonLabel>
                    <IonInput
                      type="number"
                      value={phVal}
                      onIonChange={(e) =>
                        setPhVal(parseFloat(e.detail.value as string))
                      }
                    />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol size="12">
                  <IonItem>
                    <IonLabel position="stacked">Moisture (%)</IonLabel>
                    <IonInput
                      type="number"
                      value={moisture}
                      onIonChange={(e) =>
                        setMoisture(parseFloat(e.detail.value as string))
                      }
                    />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow style={{ marginTop: 10 }}>
                <IonCol size="6">
                  <IonButton
                    expand="block"
                    color="success"
                    onClick={saveSoilData}
                  >
                    {editingId ? "Update" : "Save"}
                  </IonButton>
                </IonCol>
                <IonCol size="6">
                  <IonButton expand="block" color="medium" onClick={resetForm}>
                    Reset
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Dashboard;
