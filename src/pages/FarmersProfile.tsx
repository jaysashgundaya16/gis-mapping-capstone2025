import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonModal,
  IonInput,
  IonLabel,
  IonItem,
  IonLoading,
} from "@ionic/react";
import { menuOutline, createOutline, trashOutline, addOutline } from "ionicons/icons";
import SideMenu from "../components/SideMenu";

// Firestore
import { db } from "../firebaseConfig"; // ✅ Make sure this points to your firebase.ts file
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

interface Farmer {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  brgy: string;
  education: string;
  exp: number;
  financial: string;
  landArea: number;
  landTenure: string;
}

const FarmersProfile: React.FC = () => {
  const [municipality, setMunicipality] = useState("Lingion");
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);
  const [form, setForm] = useState<Partial<Farmer>>({});

  // ✅ Fetch Farmers from Firestore in real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "farmers"), (snapshot) => {
      const farmerData: Farmer[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Farmer, "id">),
      }));
      setFarmers(farmerData);
      setLoading(false);
    });

    return () => unsub(); // cleanup listener
  }, []);

  // ✅ Open Add Form
  const openAddFarmer = () => {
    setForm({});
    setEditingFarmer(null);
    setShowModal(true);
  };

  // ✅ Open Edit Form
  const openEditFarmer = (farmer: Farmer) => {
    setForm(farmer);
    setEditingFarmer(farmer);
    setShowModal(true);
  };

  // ✅ Save Farmer (Add or Update)
  const handleSave = async () => {
    if (editingFarmer) {
      const farmerRef = doc(db, "farmers", editingFarmer.id);
      await updateDoc(farmerRef, { ...form });
    } else {
      await addDoc(collection(db, "farmers"), {
        firstName: form.firstName || "",
        lastName: form.lastName || "",
        age: Number(form.age) || 0,
        gender: form.gender || "",
        brgy: form.brgy || "",
        education: form.education || "",
        exp: Number(form.exp) || 0,
        financial: form.financial || "",
        landArea: Number(form.landArea) || 0,
        landTenure: form.landTenure || "",
      });
    }
    setShowModal(false);
  };

  // ✅ Delete Farmer
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "farmers", id));
  };

  return (
    <>
      <SideMenu />
      <IonPage id="main-content">
        {/* 📌 Top Header */}
        <IonHeader>
          <IonToolbar color="dark green">
            <IonButtons slot="start">
              <IonMenuButton autoHide={false}>
                <IonIcon icon={menuOutline} />
              </IonMenuButton>
            </IonButtons>
            <IonTitle>Manolo Fortich Farmer's Information</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonLoading isOpen={loading} message="Loading farmers..." />

          {/* 📌 Government Info Row */}
          <div style={{ backgroundColor: "#07371aff", color: "white", padding: "15px" }}>
            <IonGrid>
              <IonRow>
                <IonCol size="4">
                  <h3>Local Government Officials</h3>
                  <p>Governor: manolo fortich.gov</p>
                  <p>Vice Governor: manolo fortich.vgov</p>
                  <p>Prov. Agri. Officer: manolo fortich.prago</p>
                </IonCol>
                <IonCol size="4">
                  <h3>Provincial Agriculture Personnel</h3>
                  <p>Asst. Agri Prov. Officer: manolo fortich.asstprago</p>
                  <p>Total # of Prov. Agriculturist: 1</p>
                  <p>Total # of Prov. Agricultural Tech.: 1</p>
                </IonCol>
                <IonCol size="4">
                  <h3>Select Barangay</h3>
                  <IonSelect
                    value={municipality}
                    placeholder="Select"
                    onIonChange={(e) => setMunicipality(e.detail.value)}
                  >
                    <IonSelectOption value="Lingion">Lingion</IonSelectOption>
                  </IonSelect>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>

          {/* 📌 Add Farmer Button */}
          <IonButton expand="block" color="success" className="ion-margin" onClick={openAddFarmer}>
            <IonIcon icon={addOutline} slot="start" />
            Add Farmer
          </IonButton>

          {/* 📌 Farmer Data Table */}
          <IonGrid className="ion-margin-top">
            <IonRow style={{ background: "#012917ff", color: "white", fontWeight: "bold" }}>
              <IonCol size="1">#</IonCol>
              <IonCol>First Name</IonCol>
              <IonCol>Last Name</IonCol>
              <IonCol>Age</IonCol>
              <IonCol>Gender</IonCol>
              <IonCol>Brgy</IonCol>
              <IonCol>Education</IonCol>
              <IonCol>Farming Exp</IonCol>
              <IonCol>Financial Stat</IonCol>
              <IonCol>Land Area</IonCol>
              <IonCol>Land Tenure</IonCol>
              <IonCol size="2">Options</IonCol>
            </IonRow>

            {farmers.length === 0 ? (
              <IonRow>
                <IonCol size="12" style={{ textAlign: "center", padding: "20px", color: "gray" }}>
                  No farmer records found.
                </IonCol>
              </IonRow>
            ) : (
              farmers.map((farmer, index) => (
                <IonRow key={farmer.id} style={{ borderBottom: "1px solid #ccc" }}>
                  <IonCol size="1">{index + 1}</IonCol>
                  <IonCol>{farmer.firstName}</IonCol>
                  <IonCol>{farmer.lastName}</IonCol>
                  <IonCol>{farmer.age}</IonCol>
                  <IonCol>{farmer.gender}</IonCol>
                  <IonCol>{farmer.brgy}</IonCol>
                  <IonCol>{farmer.education}</IonCol>
                  <IonCol>{farmer.exp}</IonCol>
                  <IonCol>{farmer.financial}</IonCol>
                  <IonCol>{farmer.landArea}</IonCol>
                  <IonCol>{farmer.landTenure}</IonCol>
                  <IonCol size="2">
                    <IonButton size="small" color="primary" onClick={() => openEditFarmer(farmer)}>
                      <IonIcon icon={createOutline} />
                    </IonButton>
                    <IonButton size="small" color="danger" onClick={() => handleDelete(farmer.id)}>
                      <IonIcon icon={trashOutline} />
                    </IonButton>
                  </IonCol>
                </IonRow>
              ))
            )}
          </IonGrid>

          {/* 📌 Add/Edit Modal */}
          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>{editingFarmer ? "Edit Farmer" : "Add Farmer"}</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <IonItem>
                <IonLabel position="stacked">First Name</IonLabel>
                <IonInput
                  value={form.firstName}
                  onIonChange={(e) => setForm({ ...form, firstName: e.detail.value! })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Last Name</IonLabel>
                <IonInput
                  value={form.lastName}
                  onIonChange={(e) => setForm({ ...form, lastName: e.detail.value! })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Age</IonLabel>
                <IonInput
                  type="number"
                  value={form.age}
                  onIonChange={(e) => setForm({ ...form, age: Number(e.detail.value!) })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Gender</IonLabel>
                <IonInput
                  value={form.gender}
                  onIonChange={(e) => setForm({ ...form, gender: e.detail.value! })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Barangay</IonLabel>
                <IonInput
                  value={form.brgy}
                  onIonChange={(e) => setForm({ ...form, brgy: e.detail.value! })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Education</IonLabel>
                <IonInput
                  value={form.education}
                  onIonChange={(e) => setForm({ ...form, education: e.detail.value! })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Farming Experience (years)</IonLabel>
                <IonInput
                  type="number"
                  value={form.exp}
                  onIonChange={(e) => setForm({ ...form, exp: Number(e.detail.value!) })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Financial Status</IonLabel>
                <IonInput
                  value={form.financial}
                  onIonChange={(e) => setForm({ ...form, financial: e.detail.value! })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Land Area (ha)</IonLabel>
                <IonInput
                  type="number"
                  value={form.landArea}
                  onIonChange={(e) => setForm({ ...form, landArea: Number(e.detail.value!) })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Land Tenure</IonLabel>
                <IonInput
                  value={form.landTenure}
                  onIonChange={(e) => setForm({ ...form, landTenure: e.detail.value! })}
                />
              </IonItem>

              <IonButton expand="block" className="ion-margin-top" onClick={handleSave}>
                Save
              </IonButton>
              <IonButton expand="block" color="medium" onClick={() => setShowModal(false)}>
                Cancel
              </IonButton>
            </IonContent>
          </IonModal>
        </IonContent>
      </IonPage>
    </>
  );
};

export default FarmersProfile;
