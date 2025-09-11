import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonIcon,
  IonMenu,
  IonList,
  IonItem,
  IonMenuToggle,
  IonContent as IonMenuContent,
  IonMenuButton,
  useIonRouter
} from '@ionic/react';

import { menuOutline, personCircle, mapOutline, peopleCircleOutline, logOutOutline } from 'ionicons/icons';
import SideMenu from '../components/SideMenu';

const FarmersProfile: React.FC = () => {
  const router = useIonRouter();

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
              {/* ✅ Dashboard link always first */}
              <IonItem button onClick={() => router.push('/dashboard', 'forward')}>
                <IonIcon icon={mapOutline} slot="start" />
                Dashboard
              </IonItem>
              <IonItem button onClick={() => router.push('/edit-profile', 'forward')}>
                <IonIcon icon={personCircle} slot="start" />
                Edit Profile
              </IonItem>
              <IonItem button onClick={() => router.push('/farmers-profile', 'forward')}>
                <IonIcon icon={peopleCircleOutline} slot="start" />
                Farmers Profile
              </IonItem>
              <IonItem button onClick={() => router.push('/', 'root')}>
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
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton autoHide={false}>
                <IonIcon icon={menuOutline} />
              </IonMenuButton>
            </IonButtons>
            <IonTitle>Farmers Profile</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <h2>Farmers Profile Page</h2>
          <p>This is a placeholder page where you can display farmers’ details later.</p>
        </IonContent>
      </IonPage>
    </>
  );
};

export default FarmersProfile;
