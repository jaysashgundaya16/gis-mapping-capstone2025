import React from 'react';
import MapView from '../components/MapView';
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
          <IonTitle></IonTitle>
          <IonButtons slot="end">
            <IonButton color="light" fill="clear" onClick={() => router.push('/', 'root')}>
              <IonIcon icon={logOutOutline} />
              &nbsp;Logout
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="dashboard-bg">
    
        {/* 📍 GIS Mapping Tool */}
        <IonCard className="ion-card-custom">
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={mapOutline} /> &nbsp; Soil Nutrient Crop Profiling
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <MapView />
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
