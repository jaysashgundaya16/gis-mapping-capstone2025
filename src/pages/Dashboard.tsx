import React, { useState } from "react";
import MapView from "../components/MapView";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButtons,
  IonIcon,
  IonMenu,
  IonList,
  IonItem,
  IonMenuToggle,
  IonContent as IonMenuContent,
  IonMenuButton,
  useIonRouter,
  IonButton,
  IonModal,
} from "@ionic/react";

import {
  menuOutline,
  personCircle,
  mapOutline,
  peopleCircleOutline,
  logOutOutline,
  statsChartOutline,
  leafOutline,
  closeOutline,
  expandOutline,
} from "ionicons/icons";

import SideMenu from "../components/SideMenu";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const router = useIonRouter();

  const [showFarmerStats, setShowFarmerStats] = useState(false);
  const [showCropSummary, setShowCropSummary] = useState(false);
  const [showMapFull, setShowMapFull] = useState(false); // ✅ new state for fullscreen map

  return (
    <>
      <SideMenu />

      {/* 📌 Side Menu */}
      <IonMenu side="start" contentId="main-content" swipeGesture={false}>
        <IonHeader>
          <IonToolbar color="darkgreen">
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonMenuContent>
          <IonList>
            <IonMenuToggle autoHide={false}>
              <IonItem button onClick={() => router.push("/edit-profile", "forward")}>
                <IonIcon icon={personCircle} slot="start" />
                Edit Profile
              </IonItem>
              <IonItem button onClick={() => router.push("/farmers-profile", "forward")}>
                <IonIcon icon={peopleCircleOutline} slot="start" />
                Farmers Profile
              </IonItem>
              <IonItem button onClick={() => router.push("/", "root")}>
                <IonIcon icon={logOutOutline} slot="start" />
                Logout
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonMenuContent>
      </IonMenu>

      {/* 📌 Main Content */}
      <IonPage id="main-content">
        <IonHeader translucent>
          <IonToolbar className="header-gradient">
            <IonButtons slot="start">
              <IonMenuButton autoHide={false}>
                <IonIcon icon={menuOutline} />
              </IonMenuButton>
            </IonButtons>

            <IonTitle className="dashboard-center-title">
              🌾 Soil Nutrient Crop Profiling
            </IonTitle>

            <IonButtons slot="end">
              <IonButton onClick={() => setShowFarmerStats(true)}>
                <IonIcon icon={statsChartOutline} />
              </IonButton>
              <IonButton onClick={() => setShowCropSummary(true)}>
                <IonIcon icon={leafOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen className="dashboard-bg">
          {/* 📍 GIS Mapping Tool */}
          <IonCard className="ion-card-custom">
            <IonCardHeader className="card-header-gradient">
              <IonCardTitle>
                <IonIcon icon={mapOutline} /> Map View
              </IonCardTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowMapFull(true)}>
                  <IonIcon icon={expandOutline} />
                </IonButton>
              </IonButtons>
            </IonCardHeader>
            <IonCardContent>
              <MapView />
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>

      {/* ✅ Farmer Statistics Modal */}
      <IonModal isOpen={showFarmerStats} onDidDismiss={() => setShowFarmerStats(false)}>
        <IonHeader>
          <IonToolbar className="header-gradient">
            <IonTitle>Farmer Statistics</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowFarmerStats(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="modal-content">
          <div className="stats-grid">
            <div className="stat-card gradient-green">
              <div className="stat-number">120</div>
              <p>Total Farmers</p>
            </div>
            <div className="stat-card gradient-blue">
              <div className="stat-number">80</div>
              <p>Male</p>
            </div>
            <div className="stat-card gradient-pink">
              <div className="stat-number">40</div>
              <p>Female</p>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* ✅ Crop Monitoring Summary Modal */}
      <IonModal isOpen={showCropSummary} onDidDismiss={() => setShowCropSummary(false)}>
        <IonHeader>
          <IonToolbar className="header-gradient">
            <IonTitle>Crop Monitoring Summary</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowCropSummary(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="modal-content">
          <div className="summary-box">
            <h3>✅ NPK Test Results</h3>
            <ul>
              <li><b>Nitrogen:</b> 55</li>
              <li><b>Phosphorus:</b> 42</li>
              <li><b>Potassium:</b> 61</li>
            </ul>
          </div>
        </IonContent>
      </IonModal>

      {/* ✅ Fullscreen Map Modal */}
      <IonModal isOpen={showMapFull} onDidDismiss={() => setShowMapFull(false)}>
        <IonHeader>
          <IonToolbar className="header-gradient">
            <IonTitle>🗺️ Fullscreen Map</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowMapFull(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <MapView /> {/* ✅ MapView reused fullscreen */}
        </IonContent>
      </IonModal>
    </>
  );
};

export default Dashboard;
