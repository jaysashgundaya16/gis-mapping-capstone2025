import React from "react";
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
} from "@ionic/react";

import {
  menuOutline,
  personCircle,
  mapOutline,
  peopleCircleOutline,
  logOutOutline,
} from "ionicons/icons";
import SideMenu from "../components/SideMenu";

const Dashboard: React.FC = () => {
  const router = useIonRouter();

  return (
    <>
      {/* ✅ Reusable side menu */}
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
            /* 🌈 Gradient Header */
            .header-gradient {
              background: linear-gradient(90deg, #0f2027, #2c5364, #0f2027);
              color: white;
            }

            /* 🌱 Dashboard Background */
            .dashboard-bg {
              min-height: 100vh;
              background: linear-gradient(to bottom right, #012917, #14532d, #1e3a8a);
              color: white;
              padding: 20px;
            }

            /* 📌 Card Styling */
            .ion-card-custom {
              background: rgba(255, 255, 255, 0.08);
              border-radius: 16px;
              backdrop-filter: blur(6px);
              -webkit-backdrop-filter: blur(6px);
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
          `}
        </style>

        <IonHeader translucent>
          <IonToolbar className="header-gradient">
            <IonButtons slot="start">
              <IonMenuButton autoHide={false}>
                <IonIcon icon={menuOutline} />
              </IonMenuButton>
            </IonButtons>
            <IonTitle className="dashboard-title">
              🌾 MUNICIPAL OFFICE OF AGRICULTURE
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen className="dashboard-bg">
          {/* 📍 GIS Mapping Tool */}
          <IonCard className="ion-card-custom">
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={mapOutline} /> Soil Nutrient Crop Profiling
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <MapView />
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Dashboard;
