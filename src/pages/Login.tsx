import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import './Login.css'; // Optional CSS for styling

const Login: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === '1234') {
      history.push('/home');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-page">
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol sizeMd="6" sizeSm="12" className="login-form">
              <h2>Account Login</h2>
              <IonInput
                label="User name"
                labelPlacement="floating"
                placeholder="Enter Username"
                value={username}
                onIonChange={(e) => setUsername(e.detail.value!)}
              />
              <IonInput
                label="Password"
                labelPlacement="floating"
                type="password"
                placeholder="Enter Password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
              />
              {error && <IonText color="danger">{error}</IonText>}
              <IonButton expand="block" onClick={handleLogin}>
                Sign In
              </IonButton>
              <IonText className="forgot-link">
                Forgot <a href="#">username</a> / <a href="#">password?</a>
              </IonText>
              <div className="signup-link">
                <a href="#">Sign Up</a>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
