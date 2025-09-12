import React, { useEffect, useState } from "react";
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonMenuToggle,
  IonIcon,
  useIonAlert,
  IonFooter,
  IonAvatar,
  IonButton,
} from "@ionic/react";
import {
  mapOutline,
  personCircle,
  peopleCircleOutline,
  logOutOutline,
} from "ionicons/icons";
import { useIonRouter } from "@ionic/react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

const SideMenu: React.FC = () => {
  const router = useIonRouter();
  const [presentAlert] = useIonAlert();
  const [userData, setUserData] = useState<any>(null);

  // ✅ Load user data live from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);

        const unsubDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData({
              name: docSnap.data().name || "User",
              email: firebaseUser.email,
              photoUrl: docSnap.data().photoUrl || "https://i.pravatar.cc/150",
            });
          } else {
            setUserData({
              name: "User",
              email: firebaseUser.email,
              photoUrl: "https://i.pravatar.cc/150",
            });
          }
        });

        return () => unsubDoc();
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      await presentAlert({
        header: "Logged Out",
        message: "You have been successfully logged out.",
        buttons: ["OK"],
        onDidDismiss: () => router.push("/", "root"),
      });
    } catch (error: any) {
      await presentAlert({
        header: "Logout Failed",
        message: error.message || "Something went wrong. Please try again.",
        buttons: ["OK"],
      });
    }
  };

  return (
    <IonMenu side="start" contentId="main-content" swipeGesture={false}>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          <IonMenuToggle autoHide={false}>
            {/* ✅ Dashboard */}
            <IonItem
              button
              onClick={() => {
                if (router.routeInfo.pathname !== "/dashboard") {
                  router.push("/dashboard", "root");
                }
              }}
            >
              <IonIcon icon={mapOutline} slot="start" />
              Map
            </IonItem>

            {/* ✅ Edit Profile */}
            <IonItem
              button
              onClick={() => router.push("/edit-profile", "forward")}
            >
              <IonIcon icon={personCircle} slot="start" />
              Edit Profile
            </IonItem>

            {/* ✅ Farmers Profile */}
            <IonItem
              button
              onClick={() => router.push("/farmers-profile", "forward")}
            >
              <IonIcon icon={peopleCircleOutline} slot="start" />
              Farmers Profile
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>

      {/* ✅ Footer with Avatar & Logout */}
      {userData && (
        <IonFooter style={{ padding: "12px", borderTop: "1px solid #ccc" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <IonAvatar>
              <img src={userData.photoUrl} alt="Profile" />
            </IonAvatar>
            <div style={{ flex: 1 }}>
              <strong>{userData.name}</strong>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "gray" }}>
                {userData.email}
              </p>
            </div>
          </div>

          <IonButton
            expand="block"
            color="danger"
            style={{ marginTop: "10px" }}
            onClick={handleLogout}
          >
            <IonIcon icon={logOutOutline} slot="start" />
            Logout
          </IonButton>
        </IonFooter>
      )}
    </IonMenu>
  );
};

export default SideMenu;
