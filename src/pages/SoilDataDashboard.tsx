import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar,
  IonAlert,
} from "@ionic/react";
import {
  menuOutline,
  trashOutline,
  createOutline,
  leafOutline,
  eyedropOutline,
} from "ionicons/icons";
import "./SoilDataDashboard.css";
import { db } from "../firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import SideMenu from "../components/SideMenu";
import { useIonRouter } from "@ionic/react";

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

const SoilDataDashboard: React.FC = () => {
  const router = useIonRouter();
  const [soilData, setSoilData] = useState<SoilRecord[]>([]);
  const [search, setSearch] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "soilData"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data: SoilRecord[] = [];
      snap.forEach((doc) =>
        data.push({ id: doc.id, ...(doc.data() as SoilRecord) })
      );
      setSoilData(data);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "soilData", id));
    setShowDelete(false);
  };

  const filteredData = soilData.filter((item) =>
    item.cropName?.toLowerCase().includes(search.toLowerCase())
  );

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
              🧪 Soil Data Management Dashboard
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen className="dashboard-bg">
          <div className="dashboard-top-bar">
            <IonSearchbar
              placeholder="Search by crop name..."
              value={search}
              onIonChange={(e) => setSearch(e.detail.value!)}
            />
            <IonButton
              color="success"
              onClick={() => router.push("/dashboard", "forward")}
            >
              + Add New Data
            </IonButton>
          </div>

          <IonGrid className="data-table">
            <IonRow className="table-header">
              <IonCol size="2">Crop Name</IonCol>
              <IonCol size="1">N</IonCol>
              <IonCol size="1">P</IonCol>
              <IonCol size="1">K</IonCol>
              <IonCol size="1">pH</IonCol>
              <IonCol size="1">Moisture</IonCol>
              <IonCol size="2">Location</IonCol>
              <IonCol size="2">Date</IonCol>
              <IonCol size="2" style={{ textAlign: "center" }}>
                Actions
              </IonCol>
            </IonRow>

            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <IonRow className="table-row" key={data.id}>
                  <IonCol size="2">{data.cropName}</IonCol>
                  <IonCol size="1">{data.nitrogen}</IonCol>
                  <IonCol size="1">{data.phosphorus}</IonCol>
                  <IonCol size="1">{data.potassium}</IonCol>
                  <IonCol size="1">{data.ph?.toFixed(1)}</IonCol>
                  <IonCol size="1">{data.moisture}%</IonCol>
                  <IonCol size="2">
                    <small>
                      {data.lat.toFixed(3)}, {data.lng.toFixed(3)}
                    </small>
                  </IonCol>
                  <IonCol size="2">
                    {data.timestamp?.toDate
                      ? data.timestamp.toDate().toLocaleDateString()
                      : "—"}
                  </IonCol>
                  <IonCol
                    size="2"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <IonButton
                      size="small"
                      color="medium"
                      onClick={() => router.push("/dashboard", "forward")}
                    >
                      <IonIcon icon={createOutline} />
                    </IonButton>
                    <IonButton
                      size="small"
                      color="danger"
                      onClick={() => {
                        setSelectedId(data.id || null);
                        setShowDelete(true);
                      }}
                    >
                      <IonIcon icon={trashOutline} />
                    </IonButton>
                  </IonCol>
                </IonRow>
              ))
            ) : (
              <IonRow>
                <IonCol className="empty-data">No soil data found.</IonCol>
              </IonRow>
            )}
          </IonGrid>

          <IonAlert
            isOpen={showDelete}
            header="Confirm Delete"
            message="Are you sure you want to delete this record?"
            buttons={[
              { text: "Cancel", role: "cancel" },
              {
                text: "Delete",
                role: "confirm",
                handler: () => {
                  if (selectedId) handleDelete(selectedId);
                },
              },
            ]}
            onDidDismiss={() => setShowDelete(false)}
          />
        </IonContent>
      </IonPage>
    </>
  );
};

export default SoilDataDashboard;
