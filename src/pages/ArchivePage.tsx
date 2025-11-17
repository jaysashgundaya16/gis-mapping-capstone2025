import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonMenu,
  IonMenuToggle,
  IonList,
  IonItem,
  IonLabel,
  IonFooter,
  IonAvatar,
  IonBadge,
  IonButtons,
  IonMenuButton,
  useIonAlert,
} from "@ionic/react";

import {
  createOutline,
  trashOutline,
  mapOutline,
  personCircle,
  peopleCircleOutline,
  logOutOutline,
  archiveOutline,
} from "ionicons/icons";

import { useIonRouter } from "@ionic/react";
import { auth, db } from "../firebaseConfig";
import { collection, onSnapshot, doc, deleteDoc, setDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";

const Archive: React.FC = () => {
  const router = useIonRouter();
  const [presentAlert] = useIonAlert();
  const [userData, setUserData] = useState<any>(null);
  const [archiveCount, setArchiveCount] = useState<number>(0);
  const [archives, setArchives] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // ✅ Load user data & archive count & archives
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const unsubUser = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData({
              name: docSnap.data().name || "User",
              email: firebaseUser.email,
              photoUrl:
                docSnap.data().photoUrl ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFvWEC5rEnwVLeNkBbKCJTC4qZCV0qE4qc-g&s",
            });
          } else {
            setUserData({
              name: "User",
              email: firebaseUser.email,
              photoUrl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFvWEC5rEnwVLeNkBbKCJTC4qZCV0qE4qc-g&s",
            });
          }
        });

        // ✅ Archive count
        const unsubArchiveCount = onSnapshot(collection(db, "archives"), (snapshot) => {
          setArchiveCount(snapshot.size);
        });

        return () => {
          unsubUser();
          unsubArchiveCount();
        };
      } else {
        setUserData(null);
      }
    });

    // ✅ Subscribe to archive records
    const unsubArchives = onSnapshot(collection(db, "archives"), (snapshot) => {
      const archiveData: any[] = [];
      snapshot.forEach((doc) => archiveData.push({ id: doc.id, ...doc.data() }));
      setArchives(archiveData);
    });

    return () => {
      unsubscribeAuth();
      unsubArchives();
    };
  }, []);

  // ✅ Restore record
  const handleRetrieve = async (id: string, data: any) => {
    try {
      const mainRef = doc(db, "soilTests", id);
      const archiveRef = doc(db, "archives", id);

      await setDoc(mainRef, { ...data, restoredAt: new Date() });
      await deleteDoc(archiveRef);

      alert("Record successfully restored!");
    } catch (error) {
      console.error("Error restoring record:", error);
    }
  };

  // ✅ Permanently delete
  const handlePermanentDelete = async (id: string) => {
    try {
      const archiveRef = doc(db, "archives", id);
      await deleteDoc(archiveRef);
      alert("Record permanently deleted!");
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      await presentAlert({
        header: "Logged Out",
        message: "You have been successfully logged out.",
        buttons: ["OK"],
        onDidDismiss: () => router.push("/login", "root"),
      });
    } catch (error: any) {
      await presentAlert({
        header: "Logout Failed",
        message: error.message || "Something went wrong. Please try again.",
        buttons: ["OK"],
      });
    }
  };

  const filtered = archives.filter((item) =>
    item.farmerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <IonPage id="main-content">
      {/* ✅ SideMenu */}
      <IonMenu side="start" contentId="main-content" swipeGesture={false} color="black">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonList>
            <IonMenuToggle autoHide={false}>
              <IonItem button onClick={() => router.push("/dashboard", "root")}>
                <IonIcon icon={mapOutline} slot="start" />
                <IonLabel color="black">Map</IonLabel>
              </IonItem>
              <IonItem button onClick={() => router.push("/edit-profile", "forward")}>
                <IonIcon icon={personCircle} slot="start" />
                <IonLabel>Edit Profile</IonLabel>
              </IonItem>
              <IonItem button onClick={() => router.push("/farmers-profile", "forward")}>
                <IonIcon icon={peopleCircleOutline} slot="start" />
                <IonLabel>Farmer's Profile</IonLabel>
              </IonItem>
              <IonItem button onClick={() => router.push("/archive", "forward")} color="primary">
                <IonIcon icon={archiveOutline} slot="start" />
                <IonLabel>Archived Records</IonLabel>
                {archiveCount > 0 && <IonBadge color="danger" slot="end">{archiveCount}</IonBadge>}
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>

        <IonFooter style={{ padding: "12px", borderTop: "1px solid #ccc" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <IonAvatar>
              <img
                src={
                  userData?.photoUrl ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFvWEC5rEnwVLeNkBbKCJTC4qZCV0qE4qc-g&s"
                }
                alt="Profile"
              />
            </IonAvatar>
            <div style={{ flex: 1 }}>
              <strong>{userData?.name || "User"}</strong>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "gray" }}>{userData?.email}</p>
            </div>
          </div>

          <IonButton expand="block" color="danger" style={{ marginTop: "10px" }} onClick={handleLogout}>
            <IonIcon icon={logOutOutline} slot="start" />
            Logout
          </IonButton>
        </IonFooter>
      </IonMenu>

      {/* ✅ Archive Page Header with Menu Button */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Archived Records</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* ✅ Archive Page Content */}
      <IonContent>
        <IonGrid>
          <IonRow className="ion-padding">
            <IonCol size="12">
              <IonSearchbar
                value={search}
                onIonInput={(e) => setSearch(e.detail.value!)}
                placeholder="Search Farmer Name..."
              />
            </IonCol>
          </IonRow>

          <IonRow style={{ background: "#f0f0f0", fontWeight: "bold", borderBottom: "2px solid #ccc" }}>
            <IonCol>#</IonCol>
            <IonCol>Farmer Name</IonCol>
            <IonCol>Site</IonCol>
            <IonCol>Crop</IonCol>
            <IonCol>Latitude</IonCol>
            <IonCol>Longitude</IonCol>
            <IonCol size="2">Actions</IonCol>
          </IonRow>

          {filtered.length === 0 ? (
            <IonRow>
              <IonCol className="ion-text-center ion-padding">No archived records.</IonCol>
            </IonRow>
          ) : (
            filtered.map((item, index) => (
              <IonRow
                key={item.id}
                style={{ borderBottom: "1px solid #ddd", background: index % 2 === 0 ? "#fff" : "#fafafa" }}
              >
                <IonCol>{index + 1}</IonCol>
                <IonCol>{item.farmerName}</IonCol>
                <IonCol>{item.siteOfFarm}</IonCol>
                <IonCol>{item.crop}</IonCol>
                <IonCol>{item.lat}</IonCol>
                <IonCol>{item.lng}</IonCol>

                <IonCol size="2">
                  <IonButton color="success" size="small" onClick={() => handleRetrieve(item.id, item)}>
                    <IonIcon icon={createOutline} />
                  </IonButton>

                  
                </IonCol>
              </IonRow>
            ))
          )}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Archive;
