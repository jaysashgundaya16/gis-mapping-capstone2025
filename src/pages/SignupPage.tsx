import React, { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';

const SignupPage: React.FC = () => {
  const router = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    console.log('Registering:', { email, password });
    // Add actual registration logic here (e.g., Supabase or Firebase)
    router.push('/dashboard', 'forward');
  };

  return (
    <IonPage>
      <style>
        {`
          .signup-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(to left, #dee7faff, #050505ff);
            padding: 20px;
          }
          .signup-box {
            background-color: #000;
            padding: 40px;
            border-radius: 12px;
            max-width: 400px;
            width: 100%;
            box-shadow:
              0 0 20px rgba(255, 255, 255, 0.4),
              0 0 30px rgba(255, 215, 0, 0.2),
              0 0 40px rgba(255, 255, 255, 0.3);
            color: white;
          }
          .signup-box h2 {
            text-align: center;
            margin-bottom: 20px;
          }
          .signup-box ion-item {
            --background: transparent;
            --color: white;
            --highlight-color-focused: #ffd700;
            margin-bottom: 20px;
          }
        `}
      </style>

      <IonHeader translucent>
        <IonToolbar style={{ background: 'transparent', boxShadow: 'none' }}>
          <IonTitle style={{ color: 'white' }}>BUGTA</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="signup-container">
          <div className="signup-box">
            <h2>Create Account</h2>
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
                required
              />
            </IonItem>
            <IonButton expand="block" color="warning" onClick={handleRegister}>
              Register
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignupPage;
