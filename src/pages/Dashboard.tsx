import React from 'react';
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
  IonButton,
  IonButtons,
  IonIcon,
  useIonRouter
} from '@ionic/react';

import { personCircle, mapOutline, analyticsOutline, logOutOutline } from 'ionicons/icons';

const Dashboard: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage>
      <style>
        {`
          .dashboard-bg {
            min-height: 100vh;
            background: linear-gradient(to bottom right, #0f2027, #203a43, #2c5364);
            color: white;
            padding: 20px;
          }
          .dashboard-title {
            font-size: 1.5rem;
            text-align: center;
            color: white;
            margin: 20px 0;
          }
          .ion-card-custom {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            backdrop-filter: blur(6px);
            color: white;
          }
        `}
      </style>

      <IonHeader translucent>
        <IonToolbar style={{ background: 'transparent' }}>
          <IonTitle style={{ color: 'white' }}>Dashboard</IonTitle>
          <IonButtons slot="end">
            <IonButton color="light" fill="clear" onClick={() => router.push('/', 'root')}>
              <IonIcon icon={logOutOutline} />
              &nbsp;Logout
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="dashboard-bg">
        <div className="dashboard-title">Welcome to BUGTA - GIS Mapping System</div>

        {/* 👤 Profile Card */}
        <IonCard className="ion-card-custom">
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={personCircle} /> &nbsp; User Profile
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p><strong>Name:</strong> Juan Dela Cruz</p>
            <p><strong>Email:</strong> juan@example.com</p>
            <p><strong>Role:</strong> Farmer / Field Officer</p>
          </IonCardContent>
        </IonCard>

        {/* 🗺️ Soil Data Viewer */}
        <IonCard className="ion-card-custom">
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={analyticsOutline} /> &nbsp; Soil Nutrient Data
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Soil nitrogen levels are moderate in Region A.</p>
            <p>Phosphorus content is high in Region B.</p>
            <IonButton expand="block" color="warning" onClick={() => alert('This will link to a soil data viewer.')}>
              View Full Soil Report
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* 📍 GIS Mapping Tool */}
        <IonCard className="ion-card-custom">
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={mapOutline} /> &nbsp; GIS Mapping Tools
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Use interactive maps to view field health and soil layers.</p>
            <IonButton expand="block" color="tertiary" onClick={() => alert('This will open your GIS map viewer.')}>
              Launch Map
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
