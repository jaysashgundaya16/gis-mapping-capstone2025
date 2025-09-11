import React, { useState, useEffect } from "react";
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
  IonButton,
  useIonAlert,
  IonAvatar,
} from "@ionic/react";
import SideMenu from "../components/SideMenu";
import { auth, db } from "../firebaseConfig";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditProfile: React.FC = () => {
  const [presentAlert] = useIonAlert();

  // Profile states
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string>("https://i.pravatar.cc/300");

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const storage = getStorage();

  // ✅ Load user data when logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        setEmail(user.email || "");

        // Load Firestore profile
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setPhone(data.phone || "");
          setPhotoUrl(data.photoUrl || "https://i.pravatar.cc/300");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Save profile (name, phone, email)
  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Update email in Firebase Auth
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // Save to Firestore
      await setDoc(
        doc(db, "users", user.uid),
        { name, email, phone, photoUrl },
        { merge: true }
      );

      presentAlert({
        header: "Profile Updated",
        message: "Your profile has been successfully updated.",
        buttons: ["OK"],
      });
    } catch (error: any) {
      presentAlert({
        header: "Error",
        message: error.message,
        buttons: ["OK"],
      });
    }
  };

  // ✅ Upload new profile photo
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file || !uid) return;

      const storageRef = ref(storage, `profilePhotos/${uid}.jpg`);
      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);
      setPhotoUrl(downloadURL);

      // Save photo URL in Firestore
      await setDoc(doc(db, "users", uid), { photoUrl: downloadURL }, { merge: true });

      presentAlert({
        header: "Profile Picture Updated",
        message: "Your profile photo has been uploaded successfully.",
        buttons: ["OK"],
      });
    } catch (error: any) {
      presentAlert({
        header: "Error",
        message: error.message,
        buttons: ["OK"],
      });
    }
  };

  // ✅ Update password
  const handleUpdatePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        return presentAlert({
          header: "Error",
          message: "Passwords do not match.",
          buttons: ["OK"],
        });
      }

      const user = auth.currentUser;
      if (!user || !user.email) return;

      // Re-authenticate before password change
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      presentAlert({
        header: "Password Updated",
        message: "Your password has been successfully changed.",
        buttons: ["OK"],
      });

      // Reset fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      presentAlert({
        header: "Error",
        message: error.message,
        buttons: ["OK"],
      });
    }
  };

  // ✅ Close account
  const handleCloseAccount = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await deleteUser(user);

      presentAlert({
        header: "Account Deleted",
        message: "Your account has been permanently deleted.",
        buttons: ["OK"],
      });
    } catch (error: any) {
      presentAlert({
        header: "Error",
        message: error.message,
        buttons: ["OK"],
      });
    }
  };

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
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {/* Left Profile Card */}
            <IonCard style={{ flex: "1 1 250px", maxWidth: "300px", textAlign: "center" }}>
              <IonAvatar style={{ width: "120px", height: "120px", margin: "20px auto" }}>
                <img src={photoUrl} alt="Profile" />
              </IonAvatar>
              <IonCardHeader>
                <IonCardTitle>{name || "Your Name"}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{email}</p>
                <p>{phone}</p>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                <IonButton expand="block" color="danger" style={{ marginTop: "10px" }} onClick={handleCloseAccount}>
                  Close Account
                </IonButton>
              </IonCardContent>
            </IonCard>

            {/* Right Form */}
            <div style={{ flex: "2 1 500px", minWidth: "300px" }}>
              <h2>User Information</h2>
              <IonItem>
                <IonLabel position="stacked">Name</IonLabel>
                <IonInput value={name} onIonChange={(e) => setName(e.detail.value!)} />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput value={email} onIonChange={(e) => setEmail(e.detail.value!)} />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Phone</IonLabel>
                <IonInput value={phone} onIonChange={(e) => setPhone(e.detail.value!)} />
              </IonItem>

              <IonButton expand="block" style={{ marginTop: "16px" }} onClick={handleSaveProfile}>
                Save Now
              </IonButton>

              <h2 style={{ marginTop: "30px" }}>Password</h2>
              <IonItem>
                <IonLabel position="stacked">Current Password</IonLabel>
                <IonInput
                  type="password"
                  value={currentPassword}
                  onIonChange={(e) => setCurrentPassword(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">New Password</IonLabel>
                <IonInput
                  type="password"
                  value={newPassword}
                  onIonChange={(e) => setNewPassword(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Confirm New Password</IonLabel>
                <IonInput
                  type="password"
                  value={confirmPassword}
                  onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                />
              </IonItem>

              <IonButton
                expand="block"
                color="success"
                style={{ marginTop: "16px" }}
                onClick={handleUpdatePassword}
              >
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
