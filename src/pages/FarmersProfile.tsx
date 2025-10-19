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
  IonSearchbar,
} from "@ionic/react";
import { menuOutline, createOutline, trashOutline, addOutline } from "ionicons/icons";
import SideMenu from "../components/SideMenu";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

interface SoilTest {
  id: string;
  farmerName: string;
  siteOfFarm: string;
  area: string;
  crop: string;
  ph: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  lime: string;
  nVal: string;
  pVal: string;
  kVal: string;
}

const FarmersProfile: React.FC = () => {
  const [municipality, setMunicipality] = useState("Lingion");
  const [records, setRecords] = useState<SoilTest[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<SoilTest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SoilTest | null>(null);
  const [form, setForm] = useState<Partial<SoilTest>>({});

  // ✅ Fetch all soil test records
  useEffect(() => {
    const q = query(collection(db, "soilTests"), orderBy("farmerName"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: SoilTest[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<SoilTest, "id">),
        }));
        setRecords(data);
        setFilteredRecords(data);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore fetch error:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // ✅ Filter records by search term
  useEffect(() => {
    const filtered = records.filter((rec) =>
      rec.farmerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecords(filtered);
  }, [searchTerm, records]);

  // ✅ Add new record
  const openAdd = () => {
    setForm({});
    setEditingRecord(null);
    setShowModal(true);
  };

  // ✅ Edit existing record
  const openEdit = (record: SoilTest) => {
    setForm(record);
    setEditingRecord(record);
    setShowModal(true);
  };

  // ✅ Save record
  const handleSave = async () => {
    if (!form.farmerName || !form.siteOfFarm || !form.area || !form.crop) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      if (editingRecord) {
        await updateDoc(doc(db, "soilTests", editingRecord.id), { ...form });
      } else {
        await addDoc(collection(db, "soilTests"), {
          farmerName: form.farmerName,
          siteOfFarm: form.siteOfFarm,
          area: form.area,
          crop: form.crop,
          ph: form.ph || "",
          nitrogen: form.nitrogen || "",
          phosphorus: form.phosphorus || "",
          potassium: form.potassium || "",
          lime: form.lime || "",
          nVal: form.nVal || "",
          pVal: form.pVal || "",
          kVal: form.kVal || "",
        });
      }
    } catch (err) {
      console.error("Error saving record:", err);
      alert("Error saving record. Check console for details.");
    }

    setShowModal(false);
    setEditingRecord(null);
    setForm({});
  };

  // ✅ Delete record
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await deleteDoc(doc(db, "soilTests", id));
    }
  };

  return (
    <>
      <SideMenu />
      <IonPage id="main-content">
        {/* 📌 Header */}
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

        <IonContent fullscreen>
          <IonLoading
            isOpen={loading}
            message="Loading soil test records..."
            spinner="circles"
          />

          {!loading && (
            <>
              {/* 📌 Government Info */}
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

              {/* 📌 Search + Add */}
              <IonGrid>
                <IonRow className="ion-align-items-center ion-padding-horizontal ion-margin-top">
                  <IonCol size="8">
                    <IonSearchbar
                      value={searchTerm}
                      debounce={400}
                      onIonInput={(e) => setSearchTerm(e.detail.value!)}
                      placeholder="Search by Farmer Name..."
                    />
                  </IonCol>
                  <IonCol size="4" className="ion-text-right">
                    <IonButton color="success" onClick={openAdd}>
                      <IonIcon icon={addOutline} slot="start" />
                      Add Record
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>

              {/* 📌 Data Table */}
              <IonGrid>
                <IonRow style={{ background: "#012917ff", color: "white", fontWeight: "bold" }}>
                  <IonCol size="1">#</IonCol>
                  <IonCol>Farmer Name</IonCol>
                  <IonCol>Site of Farm</IonCol>
                  <IonCol>Area</IonCol>
                  <IonCol>Crop</IonCol>
                  <IonCol>pH</IonCol>
                  <IonCol>N</IonCol>
                  <IonCol>P</IonCol>
                  <IonCol>K</IonCol>
                  <IonCol>Lime</IonCol>
                  <IonCol>N (kg)</IonCol>
                  <IonCol>P (kg)</IonCol>
                  <IonCol>K (kg)</IonCol>
                  <IonCol size="2">Options</IonCol>
                </IonRow>

                {filteredRecords.length === 0 ? (
                  <IonRow>
                    <IonCol
                      size="12"
                      style={{ textAlign: "center", padding: "20px", color: "gray" }}
                    >
                      No matching records found.
                    </IonCol>
                  </IonRow>
                ) : (
                  filteredRecords.map((rec, index) => (
                    <IonRow key={rec.id} style={{ borderBottom: "1px solid #ccc" }}>
                      <IonCol size="1">{index + 1}</IonCol>
                      <IonCol>{rec.farmerName}</IonCol>
                      <IonCol>{rec.siteOfFarm}</IonCol>
                      <IonCol>{rec.area}</IonCol>
                      <IonCol>{rec.crop}</IonCol>
                      <IonCol>{rec.ph}</IonCol>
                      <IonCol>{rec.nitrogen}</IonCol>
                      <IonCol>{rec.phosphorus}</IonCol>
                      <IonCol>{rec.potassium}</IonCol>
                      <IonCol>{rec.lime}</IonCol>
                      <IonCol>{rec.nVal}</IonCol>
                      <IonCol>{rec.pVal}</IonCol>
                      <IonCol>{rec.kVal}</IonCol>
                      <IonCol size="2">
                        <IonButton size="small" color="primary" onClick={() => openEdit(rec)}>
                          <IonIcon icon={createOutline} />
                        </IonButton>
                        <IonButton size="small" color="danger" onClick={() => handleDelete(rec.id)}>
                          <IonIcon icon={trashOutline} />
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  ))
                )}
              </IonGrid>
            </>
          )}

          {/* 📌 Add/Edit Modal */}
          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>{editingRecord ? "Edit Soil Test Record" : "Add Soil Test Record"}</IonTitle>
              </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
              {[
                { label: "Name of Farmer", key: "farmerName" },
                { label: "Site of Farm", key: "siteOfFarm" },
                { label: "Area (ha)", key: "area" },
                { label: "Crop", key: "crop" },
                { label: "pH", key: "ph" },
                { label: "Lime (tons/ha)", key: "lime" },
                { label: "N (kg/ha/kg/plant)", key: "nVal" },
                { label: "P (kg/ha/kg/plant)", key: "pVal" },
                { label: "K (kg/ha/kg/plant)", key: "kVal" },
              ].map((field) => (
                <IonItem key={field.key}>
                  <IonLabel position="stacked">{field.label}</IonLabel>
                  <IonInput
                    value={(form as any)[field.key]}
                    onIonChange={(e) => setForm({ ...form, [field.key]: e.detail.value! })}
                  />
                </IonItem>
              ))}

              {["nitrogen", "phosphorus", "potassium"].map((nutrient) => (
                <IonItem key={nutrient}>
                  <IonLabel position="stacked">
                    {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
                  </IonLabel>
                  <IonSelect
                    value={(form as any)[nutrient]}
                    onIonChange={(e) => setForm({ ...form, [nutrient]: e.detail.value })}
                  >
                    <IonSelectOption value="L">Low</IonSelectOption>
                    <IonSelectOption value="M">Medium</IonSelectOption>
                    <IonSelectOption value="H">High</IonSelectOption>
                  </IonSelect>
                </IonItem>
              ))}

              <IonButton expand="block" color="success" onClick={handleSave} className="ion-margin-top">
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
