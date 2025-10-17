import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonModal,
} from "@ionic/react";
import { expandOutline, closeOutline, mapOutline } from "ionicons/icons";
import MapView from "../components/MapView";
import "./Dashboard.css";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

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

const GuestDashboard: React.FC = () => {
  const [showMapFull, setShowMapFull] = useState(false);
  const [soilRecords, setSoilRecords] = useState<SoilRecord[]>([]);

  // Live sync with admin updates
  useEffect(() => {
    const q = query(collection(db, "soilData"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data: SoilRecord[] = [];
      snap.forEach((doc) => data.push({ id: doc.id, ...(doc.data() as SoilRecord) }));
      setSoilRecords(data);
    });
    return () => unsub();
  }, []);

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar className="header-gradient">
          <IonTitle className="dashboard-center-title">
            🌾 Soil Nutrient Crop Profiling (Guest)
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowMapFull(true)}>
              <IonIcon icon={expandOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="dashboard-bg">
        <div
          style={{
            margin: "16px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            background: "white",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, #060606, #014b1a)",
              color: "white",
              padding: "12px 16px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>
              <IonIcon icon={mapOutline} /> Map View
            </span>
          </div>

          <div style={{ height: "80vh", width: "100%" }}>
            <MapView markers={soilRecords.map(r => ({
              ...r,
              latitude: r.lat,
              longitude: r.lng
            }))} />
          </div>
        </div>
      </IonContent>

      <IonModal isOpen={showMapFull} onDidDismiss={() => setShowMapFull(false)}>
        <IonHeader>
          <IonToolbar className="header-gradient">
            <IonTitle>🗺️ Fullscreen Map (Guest)</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowMapFull(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <MapView markers={soilRecords.map(r => ({
            ...r,
            latitude: r.lat,
            longitude: r.lng
          }))} />
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default GuestDashboard;
