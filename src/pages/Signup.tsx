import React from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter
} from '@ionic/react';

const SignupPage: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage>
      <style>
        {`
          .hover-glow span {
            transition: all 0.4s ease;
            display: inline-block;
          }
          .hover-glow:hover span {
            color: #fff;
            text-shadow: 0 0 8px #ffffff, 0 0 12px #ffd700;
            transform: translateY(-2px);
          }
          .hover-glow:hover {
            transform: translateY(-3px);
          }
          .section-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(to left, #dee7fa, #050505);
            padding: 20px;
          }
          .glow-box {
            transition: all 0.4s ease;
            box-shadow: 0 8px 16px rgba(255,255,255,0.1);
            border-radius: 16px;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            width: 100%;
            max-width: 600px;
            padding: 40px 32px;
          }
          .form-title {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            text-align: center;
            color: white;
          }
          .form-subtext {
            font-size: 1rem;
            margin-bottom: 2rem;
            text-align: center;
            color: #ddd;
          }
          .ion-item-custom {
            margin-bottom: 16px;
            --background: transparent;
            --color: white;
            --border-radius: 12px;
            --padding-start: 12px;
            --padding-end: 12px;
            --highlight-color-focused: #ffd700;
          }
        `}
      </style>

      <IonHeader translucent>
        <IonToolbar style={{ background: 'transparent', boxShadow: 'none' }}>
          <IonTitle style={{ color: 'white' }}>BUGTA</IonTitle>
          <IonButtons slot="end" style={{ gap: '27px' }}>
            <IonButton className="hover-glow" fill="clear" onClick={() => router.push('/', 'back')}>
              <span style={{ fontSize: '0.95rem' }}>Home</span>
            </IonButton>
            <IonButton className="hover-glow" fill="outline" onClick={() => router.push('/login', 'forward')}>
              <span>Log In</span>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="section-container">
          <div className="glow-box">
            <h1 className="form-title">Create Your Account</h1>
            <p className="form-subtext">Sign up to access soil nutrient data, GIS tools, and more.</p>
            <form onSubmit={(e) => { e.preventDefault(); router.push('/dashboard'); }}>
              <IonItem className="ion-item-custom" lines="inset">
                <IonLabel position="floating">Full Name</IonLabel>
                <IonInput type="text" required />
              </IonItem>
              <IonItem className="ion-item-custom" lines="inset">
                <IonLabel position="floating">Username</IonLabel>
                <IonInput type="text" required />
              </IonItem>
              <IonItem className="ion-item-custom" lines="inset">
                <IonLabel position="floating">Email Address</IonLabel>
                <IonInput type="email" required />
              </IonItem>
              <IonItem className="ion-item-custom" lines="inset">
                <IonLabel position="floating">Password</IonLabel>
                <IonInput type="password" required />
              </IonItem>
              <IonItem className="ion-item-custom" lines="inset">
                <IonLabel position="floating">Confirm Password</IonLabel>
                <IonInput type="password" required />
              </IonItem>
              <IonItem className="ion-item-custom" lines="inset">
                <IonLabel>Date of Birth</IonLabel>
                <IonDatetime
                  presentation="date"
                  style={{ width: '100%' }}
                />
              </IonItem>
              <IonItem className="ion-item-custom" lines="inset">
                <IonLabel position="floating">Phone Number</IonLabel>
                <IonInput type="tel" required />
              </IonItem>
              <IonButton type="submit" expand="block" color="warning" style={{ marginTop: '24px' }}>
                Sign Up
              </IonButton>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignupPage;
