import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  useIonRouter
} from '@ionic/react';

const Dashboard: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage>
      <style>
        {`
          .dashboard-container {
            height: 100vh;
            display: flex;
            flex-direction: column;
            background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
            color: white;
          }
          .dashboard-content {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
          }
          .dashboard-title {
            font-size: 2.2rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }
          .dashboard-subtext {
            font-size: 1.1rem;
            color: #dcdcdc;
            margin-bottom: 2rem;
          }
        `}
      </style>

      <IonHeader translucent>
        <IonToolbar style={{ background: 'transparent', boxShadow: 'none' }}>
          <IonTitle style={{ color: 'white' }}>Dashboard</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="outline" color="light" onClick={() => router.push('/', 'root')}>
              Logout
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="dashboard-container">
        <div className="dashboard-content">
          <div>
            <div className="dashboard-title">Welcome to BUGTA</div>
            <div className="dashboard-subtext">
              Explore GIS tools, view soil nutrient data, and manage your account efficiently.
            </div>
            <IonButton expand="block" color="warning" onClick={() => alert('This is a placeholder action.')}>
              View Soil Data
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
