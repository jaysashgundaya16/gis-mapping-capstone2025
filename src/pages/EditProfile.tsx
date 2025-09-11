import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/react';
import SideMenu from '../components/SideMenu';

const EditProfile: React.FC = () => {
  const [name, setName] = useState('Esther Howard');
  const [email, setEmail] = useState('esther.howard@example.com');
  const [phone, setPhone] = useState('09123456789');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <>
      {/* 📌 Side Menu */}
      <SideMenu />

      <IonPage id="main-content">
        <IonHeader translucent>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Edit Profile</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen className="ion-padding">
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {/* Left Profile Card */}
            <IonCard style={{ flex: '1 1 250px', maxWidth: '300px' }}>
              <img
                src="https://i.pravatar.cc/300"
                alt="Profile"
                style={{ borderRadius: '8px 8px 0 0', width: '100%' }}
              />
              <IonCardHeader>
                <IonCardTitle>{name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{email}</p>
                <p>{phone}</p>
                <IonButton expand="block" color="danger">Close Account</IonButton>
              </IonCardContent>
            </IonCard>

            {/* Right Form */}
            <div style={{ flex: '2 1 500px', minWidth: '300px' }}>
              <h2>User Information</h2>
              <IonItem>
                <IonLabel position="stacked">Name</IonLabel>
                <IonInput value={name} onIonChange={e => setName(e.detail.value!)} />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput value={email} onIonChange={e => setEmail(e.detail.value!)} />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Phone</IonLabel>
                <IonInput value={phone} onIonChange={e => setPhone(e.detail.value!)} />
              </IonItem>

              <IonButton expand="block" style={{ marginTop: '16px' }}>Save Now</IonButton>

              <h2 style={{ marginTop: '30px' }}>Password</h2>
              <IonItem>
                <IonLabel position="stacked">Current Password</IonLabel>
                <IonInput type="password" value={currentPassword} onIonChange={e => setCurrentPassword(e.detail.value!)} />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">New Password</IonLabel>
                <IonInput type="password" value={newPassword} onIonChange={e => setNewPassword(e.detail.value!)} />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Confirm New Password</IonLabel>
                <IonInput type="password" value={confirmPassword} onIonChange={e => setConfirmPassword(e.detail.value!)} />
              </IonItem>

              <IonButton expand="block" color="success" style={{ marginTop: '16px' }}>
                Update Password
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default EditProfile;
