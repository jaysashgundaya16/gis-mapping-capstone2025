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
} from "ionicons/icons";

import SideMenu from "../components/SideMenu";

const Dashboard: React.FC = () => {
  const router = useIonRouter();

  // ✅ Modal States
  const [showFarmerStats, setShowFarmerStats] = useState(false);
  const [showCropSummary, setShowCropSummary] = useState(false);

  // ✅ Open Functions
  const openFarmerStats = () => setShowFarmerStats(true);
  const openCropSummary = () => setShowCropSummary(true);

  return (
    <>
      <SideMenu />

      {/* 📌 Side Menu */}
      <IonMenu side="start" contentId="main-content" swipeGesture={false}>
        <IonHeader>
          <IonToolbar color="dark">
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonMenuContent>
          <IonList>
            <IonMenuToggle autoHide={false}>
              <IonItem
                button
                onClick={() => router.push("/edit-profile", "forward")}
              >
                <IonIcon icon={personCircle} slot="start" />
                Edit Profile
              </IonItem>
              <IonItem
                button
                onClick={() => router.push("/farmers-profile", "forward")}
              >
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
        <style>
          {`
            .header-gradient {
              background: linear-gradient(90deg, #0f2027, #2c5364, #0f2027);
              color: white;
            }
            .dashboard-bg {
              min-height: 100vh;
              background: linear-gradient(to bottom right, #012917, #14532d, #1e3a8a);
              color: white;
              padding: 20px;
            }
            .ion-card-custom {
              background: rgba(255, 255, 255, 0.08);
              border-radius: 16px;
              backdrop-filter: blur(6px);
              border: 1px solid rgba(255, 255, 255, 0.15);
              color: white;
              margin-top: 20px;
              box-shadow: 0 6px 20px rgba(0,0,0,0.25);
            }
            .dashboard-title {
              font-size: 1.4rem;
              font-weight: bold;
              margin: 0;
              text-align: center;
              letter-spacing: 1px;
            }
            .stats-row {
              display: flex;
              justify-content: space-around;
              text-align: center;
              margin-top: 10px;
            }
            .stat-box {
              flex: 1;
              margin: 10px;
              padding: 15px;
              border-radius: 12px;
              background: rgba(255,255,255,0.1);
              border: 1px solid rgba(255,255,255,0.2);
            }
            .stat-number {
              font-size: 1.5rem;
              font-weight: bold;
              margin-bottom: 5px;
            }
          `}
        </style>

        <IonHeader translucent>
          <IonToolbar className="header-gradient">
            <IonButtons slot="start">
              <IonMenuButton autoHide={false}>
                <IonIcon icon={menuOutline} />
              </IonMenuButton>
            </IonButtons>

            {/* 📌 Title */}
            <IonTitle className="dashboard-title">
              🌾 Soil Nutrient Crop Profiling
            </IonTitle>

            {/* 📌 Right Navbar Buttons */}
            <IonButtons slot="end">
              <IonButton onClick={openFarmerStats}>
                <IonIcon icon={statsChartOutline} />
              </IonButton>
              <IonButton onClick={openCropSummary}>
                <IonIcon icon={leafOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen className="dashboard-bg">
          {/* 📍 GIS Mapping Tool */}
          <IonCard className="ion-card-custom">
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={mapOutline} /> Map View
              </IonCardTitle>
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
          <IonToolbar color="dark">
            <IonTitle>Farmer Statistics</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowFarmerStats(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-number">120</div>
              Total Farmers
            </div>
            <div className="stat-box">
              <div className="stat-number">80</div>
              Male
            </div>
            <div className="stat-box">
              <div className="stat-number">40</div>
              Female
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* ✅ Crop Monitoring Summary Modal */}
      <IonModal isOpen={showCropSummary} onDidDismiss={() => setShowCropSummary(false)}>
        <IonHeader>
          <IonToolbar color="dark">
            <IonTitle>Crop Monitoring Summary</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowCropSummary(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <p style={{ padding: "20px" }}>
            ✅ NPK test results summary will appear here. <br />
            Example: Nitrogen: 55, Phosphorus: 42, Potassium: 61
          </p>
        </IonContent>
      </IonModal>
    </>
  );
};

export default Dashboard;
