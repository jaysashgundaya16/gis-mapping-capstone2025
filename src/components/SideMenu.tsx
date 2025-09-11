import React from "react";
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
} from "@ionic/react";
import {
  mapOutline,
  personCircle,
  peopleCircleOutline,
  logOutOutline,
} from "ionicons/icons";
import { useIonRouter } from "@ionic/react";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig"; // ✅ Firebase auth

const SideMenu: React.FC = () => {
  const router = useIonRouter();
  const [presentAlert] = useIonAlert();

  // ✅ Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase logout
      await presentAlert({
        header: "Logged Out",
        message: "You have been successfully logged out.",
        buttons: ["OK"],
        onDidDismiss: () => router.push("/", "root"), // redirect to login/home
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
              Dashboard
            </IonItem>

            {/* ✅ Edit Profile */}
            <IonItem button onClick={() => router.push("/edit-profile", "forward")}>
              <IonIcon icon={personCircle} slot="start" />
              Edit Profile
            </IonItem>

            {/* ✅ Farmers Profile */}
            <IonItem button onClick={() => router.push("/farmers-profile", "forward")}>
              <IonIcon icon={peopleCircleOutline} slot="start" />
              Farmers Profile
            </IonItem>

            {/* ✅ Logout */}
            <IonItem button onClick={handleLogout}>
              <IonIcon icon={logOutOutline} slot="start" />
              Logout
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
