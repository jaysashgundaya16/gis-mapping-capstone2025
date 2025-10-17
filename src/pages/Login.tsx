import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCheckbox,
  useIonRouter,
  useIonAlert,
  IonSpinner,
} from "@ionic/react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import "./Login.css";

const LoginPage: React.FC = () => {
  const router = useIonRouter();
  const [presentAlert] = useIonAlert();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const allowedAdminEmail = "gundayajaysash@gmail.com";

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // ✅ Email/Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      if (rememberMe) localStorage.setItem("rememberedEmail", email);
      else localStorage.removeItem("rememberedEmail");

      if (user.email === allowedAdminEmail) {
        await presentAlert({
          header: "Admin Login",
          message: "Welcome back, Admin!",
          buttons: [{ text: "OK", handler: () => router.push("/dashboard", "root") }],
        });
      } else {
        await presentAlert({
          header: "Guest Access",
          message: "You are logged in as Guest (Farmer).",
          buttons: [
            {
              text: "OK",
              handler: () => {
                localStorage.setItem("guestLogin", "true");
                router.push("/guest-dashboard", "root");
              },
            },
          ],
        });
      }
    } catch (error: any) {
      const message =
        error.code === "auth/user-not-found"
          ? "No account found with this email."
          : error.code === "auth/wrong-password"
          ? "Incorrect password."
          : error.code === "auth/invalid-email"
          ? "Invalid email address."
          : "Something went wrong.";

      await presentAlert({ header: "Login Failed", message, buttons: ["OK"] });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      await presentAlert({
        header: "Missing Email",
        message: "Enter your email to reset password.",
        buttons: ["OK"],
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      await presentAlert({
        header: "Password Reset",
        message: "A reset link has been sent to your email.",
        buttons: ["OK"],
      });
    } catch {
      await presentAlert({
        header: "Error",
        message: "Failed to send reset link. Try again.",
        buttons: ["OK"],
      });
    }
  };

  // ✅ Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email === allowedAdminEmail) {
        router.push("/dashboard", "root");
      } else {
        localStorage.setItem("guestLogin", "true");
        router.push("/guest-dashboard", "root");
      }
    } catch (error: any) {
      await presentAlert({
        header: "Google Login Failed",
        message: error.message || "Something went wrong.",
        buttons: ["OK"],
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Guest Login
  const handleGuestLogin = () => {
    localStorage.setItem("guestLogin", "true");
    router.push("/guest-dashboard", "root");
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="login-page-container">
          <div className="login-section">
            <div className="login-box">
              <h2 className="login-form-title">ADMIN LOGIN</h2>
              <p className="login-form-subtext">Only admin can log in. Others continue as guest.</p>

              <form onSubmit={handleLogin}>
                <IonItem className="login-ion-item" lines="inset">
                  <IonLabel position="floating">Email</IonLabel>
                  <IonInput
                    type="email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                    required
                  />
                </IonItem>

                <IonItem className="login-ion-item" lines="inset">
                  <IonLabel position="floating">Password</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value!)}
                    required
                  />
                </IonItem>

                <div className="login-remember-me">
                  <IonCheckbox
                    checked={rememberMe}
                    onIonChange={(e) => setRememberMe(e.detail.checked)}
                  />
                  <span>Remind Me</span>
                </div>

                <IonButton type="submit" expand="block" color="warning" className="login-btn">
                  {loading ? <IonSpinner name="dots" /> : "Log In"}
                </IonButton>
              </form>

              <div className="login-forgot-link" onClick={handleForgotPassword}>
                Forgot Password?
              </div>

              <div className="login-divider">or</div>

              <IonButton
                expand="block"
                fill="solid"
                color="light"
                onClick={handleGoogleSignIn}
                className="login-google-btn"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="google-logo"
                />
                <span>Continue with Google</span>
              </IonButton>

              <IonButton
                expand="block"
                fill="outline"
                color="medium"
                onClick={handleGuestLogin}
                className="login-guest-btn"
              >
                Continue as Guest
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
