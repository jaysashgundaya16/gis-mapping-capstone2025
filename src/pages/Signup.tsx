import React, { useState } from "react";
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
  useIonRouter,
  useIonAlert,
} from "@ionic/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // ✅ Import Firebase config

const SignupPage: React.FC = () => {
  const router = useIonRouter();
  const [presentAlert] = useIonAlert();

  // Form states
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState<string | undefined>(undefined);
  const [phone, setPhone] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      presentAlert({
        header: "Error",
        message: "Passwords do not match!",
        buttons: ["OK"],
      });
      return;
    }

    try {
      // ✅ Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        username,
        email,
        dob,
        phone,
        createdAt: new Date(),
      });

      presentAlert({
        header: "Success",
        message: "Your account has been created!",
        buttons: ["OK"],
        onDidDismiss: () => router.push("/login", "root"),
      });
    } catch (error: any) {
      presentAlert({
        header: "Signup Failed",
        message:
          error.message || "Something went wrong. Please try again later.",
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
              onClick={() => router.push("/login", "forward")}
            >
              <span>Log In</span>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="section-container">
          <div className="glow-box">
            <h1 className="form-title">Sign Up</h1>
            <p className="form-subtext">
              Create your account and access BUGTA tools.
            </p>
            <form onSubmit={handleSignup}>
              <IonItem className="ion-item-custom" lines="inset">
                <IonLabel position="floating">Full Name</IonLabel>
                <IonInput
                  value={fullName}
                  onIonChange={(e) => setFullName(e.detail.value!)}
                  required
                />
              </IonItem>
              <IonItem className="ion-item-custom" lines="inset">
                <IonLabel position="floating">Username</IonLabel>
                <IonInput
                  value={username}
                  onIonChange={(e) => setUsername(e.detail.value!)}
                  required
                />
              </IonItem>
              <IonItem className="ion-item-custom" lines="inset">
                <IonLabel position="floating">Email Address</IonLabel>
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
              <IonItem className="ion-item-custom" lines="inset">
                <IonLabel position="floating">Confirm Password</IonLabel>
                <IonInput
                  type="password"
                  value={confirmPassword}
                  onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                  required
                />
              </IonItem>
              <IonItem className="ion-item-custom" lines="inset">
                <IonLabel>Date of Birth</IonLabel>
                <IonDatetime
                  presentation="date"
                  value={dob}
                  onIonChange={(e) =>
                    setDob(e.detail.value as string | undefined)
                  }
                />
              </IonItem>
              <IonItem className="ion-item-custom" lines="inset">
                <IonLabel position="floating">Phone Number</IonLabel>
                <IonInput
                  type="tel"
                  value={phone}
                  onIonChange={(e) => setPhone(e.detail.value!)}
                  required
                />
              </IonItem>
              <IonButton
                type="submit"
                expand="block"
                color="warning"
                style={{ marginTop: "24px" }}
              >
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
