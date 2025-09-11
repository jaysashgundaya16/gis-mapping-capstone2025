import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCheckbox,
  useIonRouter,
  useIonAlert,
} from "@ionic/react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig"; // ✅ Import Firebase auth

const LoginPage: React.FC = () => {
  const router = useIonRouter();
  const [presentAlert] = useIonAlert();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // ✅ Load saved email if Remember Me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // ✅ Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Save or clear email based on checkbox
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      await presentAlert({
        header: "Welcome Back!",
        message: "You have successfully logged in.",
        buttons: ["OK"],
        onDidDismiss: () => router.push("/dashboard", "root"),
      });
    } catch (error: any) {
      await presentAlert({
        header: "Login Failed",
        message: error.message || "Invalid email or password. Please try again.",
        buttons: ["OK"],
      });
    }
  };

  // ✅ Handle forgot password
  const handleForgotPassword = async () => {
    if (!email) {
      await presentAlert({
        header: "Missing Email",
        message: "Please enter your email address first.",
        buttons: ["OK"],
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      await presentAlert({
        header: "Password Reset",
        message: "A password reset link has been sent to your email.",
        buttons: ["OK"],
      });
    } catch (error: any) {
      await presentAlert({
        header: "Error",
        message: error.message || "Unable to send reset email. Try again.",
        buttons: ["OK"],
      });
    }
  };

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
            background: linear-gradient(to left, #050505, #dee7fa);
            padding: 20px;
          }
          .glow-box {
            transition: all 0.4s ease;
            box-shadow: 0 8px 16px rgba(255,255,255,0.1);
            border-radius: 16px;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            width: 100%;
            max-width: 500px;
            padding: 40px 32px;
          }
          .form-title {
            font-size: 2.3rem;
            margin-bottom: 0.5rem;
            text-align: center;
            color: white;
          }
          .form-subtext {
            font-size: 1rem;
            margin-bottom: 2rem;
            text-align: center;
            color: #ccc;
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
          .forgot-link {
            text-align: right;
            margin-top: 12px;
            color: #ffd700;
            cursor: pointer;
            font-size: 0.9rem;
          }
          .remember-me {
            display: flex;
            align-items: center;
            margin-top: 12px;
            color: #ccc;
            font-size: 0.9rem;
          }
          .remember-me ion-checkbox {
            margin-right: 8px;
          }
        `}
      </style>

      <IonHeader translucent>
        <IonToolbar style={{ background: "transparent", boxShadow: "none" }}>
          <IonTitle style={{ color: "white" }}>BUGTA</IonTitle>
          <IonButtons slot="end" style={{ gap: "27px" }}>
            <IonButton
              className="hover-glow"
              fill="clear"
              onClick={() => router.push("/", "back")}
            >
              <span style={{ fontSize: "0.95rem" }}>Home</span>
            </IonButton>
            <IonButton
              className="hover-glow"
              fill="outline"
              onClick={() => router.push("/signup", "forward")}
            >
              <span>Sign Up</span>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="section-container">
          <div className="glow-box">
            <h1 className="form-title">Log In</h1>
            <p className="form-subtext">Access your account and start exploring.</p>
            <form onSubmit={handleLogin}>
              <IonItem className="ion-item-custom" lines="inset">
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                  required
                />
              </IonItem>
              <IonItem className="ion-item-custom" lines="inset">
                <IonLabel position="floating">Password</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                  required
                />
              </IonItem>

              {/* ✅ Remember Me */}
              <div className="remember-me">
                <IonCheckbox
                  checked={rememberMe}
                  onIonChange={(e) => setRememberMe(e.detail.checked)}
                />
                <span>Remind Me</span>
              </div>

              <IonButton
                type="submit"
                expand="block"
                color="warning"
                style={{ marginTop: "24px" }}
              >
                Log In
              </IonButton>

              {/* ✅ Forgot Password */}
              <div
                className="forgot-link"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </div>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
