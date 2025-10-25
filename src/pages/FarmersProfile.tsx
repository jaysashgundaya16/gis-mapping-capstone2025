// src/pages/FarmersProfile.tsx
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
import {
  menuOutline,
  createOutline,
  trashOutline,
  addOutline,
  documentOutline,
} from "ionicons/icons";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  fertilizer1: string;
  fertilizer2: string;
  fertilizer3: string;
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

  // Fetch records
  useEffect(() => {
    const q = query(collection(db, "soilTests"), orderBy("farmerName"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: SoilTest[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<SoilTest, "id">),
      }));
      setRecords(data);
      setFilteredRecords(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Filter search
  useEffect(() => {
    const filtered = records.filter((rec) =>
      rec.farmerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecords(filtered);
  }, [searchTerm, records]);

  // Add/Edit
  const openAdd = () => {
    setForm({});
    setEditingRecord(null);
    setShowModal(true);
  };

  const openEdit = (record: SoilTest) => {
    setForm(record);
    setEditingRecord(record);
    setShowModal(true);
  };

  // Save
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
          fertilizer1: form.fertilizer1 || "",
          fertilizer2: form.fertilizer2 || "",
          fertilizer3: form.fertilizer3 || "",
        });
      }
    } catch (err) {
      console.error("Error saving record:", err);
      alert("Error saving record.");
    }
    setShowModal(false);
    setEditingRecord(null);
    setForm({});
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await deleteDoc(doc(db, "soilTests", id));
    }
  };

  // Generate PDF
  const generatePdfForRecord = async (rec: SoilTest) => {
    try {
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.width = "794px";
      container.style.background = "white";
      container.style.padding = "20px";
      container.style.fontFamily = "Arial, sans-serif";
      container.style.fontSize = "12px";

      container.innerHTML = `
        <div style="text-align:center; margin-bottom:8px;">
          <div style="font-weight:700; font-size:16px;">Republic of the Philippines</div>
          <div style="font-weight:700; font-size:20px;">DEPARTMENT OF AGRICULTURE</div>
          <div style="font-size:12px;">Region No. 10</div>
        </div>

        <div style="border-top:2px solid #000; padding-top:8px; margin-bottom:7px;">
          <div style="display:flex; justify-content:space-between;">
            <div><strong>Name of Farmer:</strong> ${rec.farmerName || ""}</div>
            <div><strong>Sample No.:</strong></div>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <div><strong>Site of Farm:</strong> ${rec.siteOfFarm || ""}</div>
            <div><strong>Topo:</strong> PLAIN</div>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <div><strong>Barangay / Area:</strong> ${rec.area || ""}</div>
            <div><strong>Area (ha):</strong> ${rec.area || ""}</div>
          </div>
        </div>

        <div style="display:flex; border:1px solid #000; margin-bottom:8px;">
          <div style="flex:1; border-right:1px solid #000; padding:8px;">
            <div style="font-weight:700;">SOIL TEST KIT DATA</div>
            <div><strong>pH:</strong> ${rec.ph || ""}</div>
            <div><strong>Nitrogen:</strong> ${rec.nitrogen || ""}</div>
            <div><strong>Phosphorus:</strong> ${rec.phosphorus || ""}</div>
            <div><strong>Potassium:</strong> ${rec.potassium || ""}</div>
          </div>
          <div style="flex:1; padding:8px;">
            <div style="font-weight:700; text-align:center;">NUTRIENT REQUIREMENT</div>
            <div style="display:flex; justify-content:space-between;"><div><strong>Crop:</strong></div><div>${rec.crop || ""}</div></div>
            <div style="display:flex; justify-content:space-between;"><div><strong>Lime:</strong></div><div>${rec.lime || ""}</div></div>
            <div style="display:flex; justify-content:space-between;"><div><strong>N (kg/ha):</strong></div><div>${rec.nVal || ""}</div></div>
            <div style="display:flex; justify-content:space-between;"><div><strong>P (kg/ha):</strong></div><div>${rec.pVal || ""}</div></div>
            <div style="display:flex; justify-content:space-between;"><div><strong>K (kg/ha):</strong></div><div>${rec.kVal || ""}</div></div>
          </div>
        </div>

        <!-- FERTILIZER RECOMMENDATION SECTION -->
        <div style="margin-top:10px; border-top:1px solid #000; padding-top:10px;">
          <div style="font-weight:700; text-align:center;">FERTILIZER RECOMMENDATION</div>
          <div style="text-align:left; display:inline-block; margin-top:5px; margin-bottom:25px;">
            <div>${rec.fertilizer1 || ""}</div>
            <div>${rec.fertilizer2 || ""}</div>
            <div>${rec.fertilizer3 || ""}</div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:40px; font-size:11px;">
            <div>
              Legend: L - Low &nbsp;&nbsp; M - Medium &nbsp;&nbsp; H - High &nbsp;&nbsp; S - Sufficient &nbsp;&nbsp; D - Deficient
            </div>
            <div style="text-align:right; margin-top:25px;">
              <div style="border-top:1px solid #000; width:200px; margin-left:auto;"></div>
              (Personnel In-charge)
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(container);

      const canvas = await html2canvas(container, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 10;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 5, 5, imgWidth, imgHeight);
      pdf.save(`${rec.farmerName?.replace(/\s+/g, "_") || "soil_report"}.pdf`);

      document.body.removeChild(container);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to generate PDF.");
    }
  };

  return (
    <>
      <SideMenu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar color="light">
            <IonButtons slot="start">
              <IonMenuButton autoHide={false}>
                <IonIcon icon={menuOutline} />
              </IonMenuButton>
            </IonButtons>
            <IonTitle style={{ color: "#000000ff" }}>
              Manolo Fortich Farmer's Information
            </IonTitle>
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
              <div style={{ backgroundColor: "#ffffffff", color: "black", padding: "15px" }}>
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
                        onIonChange={(e) => setMunicipality(e.detail.value)}
                      >
                        <IonSelectOption value="Lingion">Lingion</IonSelectOption>
                      </IonSelect>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>

              <IonGrid>
                <IonRow className="ion-align-items-center ion-padding-horizontal ion-margin-top">
                  <IonCol size="8">
                    <IonSearchbar
                      value={searchTerm}
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

              <IonGrid>
                <IonRow
                  style={{
                    background: "white",
                    fontWeight: "bold",
                    borderBottom: "2px solid #07371A",
                  }}
                >
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
                  <IonCol size="0.9">K (kg)</IonCol>
                  
                  <IonCol style={{ textAlign: "center" }} >Fertilizer Recommendation</IonCol>
                  
                  <IonCol size="1.8"></IonCol>
                </IonRow>

                {filteredRecords.length === 0 ? (
                  <IonRow>
                    <IonCol
                      size="12"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "gray",
                      }}
                    >
                      No matching records found.
                    </IonCol>
                  </IonRow>
                ) : (
                  filteredRecords.map((rec, index) => (
                    <IonRow
                      key={rec.id}
                      style={{
                        borderBottom: "1px solid #ccc",
                        background: index % 2 === 0 ? "white" : "#f9f9f9",
                        color: "black",
                      }}
                    >
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
                      <IonCol>{rec.fertilizer1}</IonCol>
                      <IonCol>{rec.fertilizer2}</IonCol>
                      <IonCol>{rec.fertilizer3}</IonCol>
                      <IonCol size="1.1.8">
                        <IonButton
                          size="small"
                          color="primary"
                          onClick={() => openEdit(rec)}
                        >
                          <IonIcon icon={createOutline} />
                        </IonButton>
                        <IonButton
                          size="small"
                          color="danger"
                          onClick={() => handleDelete(rec.id)}
                        >
                          <IonIcon icon={trashOutline} />
                        </IonButton>
                        <IonButton
                          size="small"
                          color="tertiary"
                          onClick={() => generatePdfForRecord(rec)}
                        >
                          <IonIcon icon={documentOutline} />
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  ))
                )}
              </IonGrid>
            </>
          )}

          {/* Modal */}
          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <IonHeader>
              <IonToolbar color="light">
                <IonTitle style={{ color: "#07371A" }}>
                  {editingRecord
                    ? "Edit Soil Test Record"
                    : "Add Soil Test Record"}
                </IonTitle>
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
                { label: "Fertilizer Recommendation 1", key: "fertilizer1" },
                { label: "Fertilizer Recommendation 2", key: "fertilizer2" },
                { label: "Fertilizer Recommendation 3", key: "fertilizer3" },
              ].map((field) => (
                <IonItem key={field.key}>
                  <IonLabel position="stacked">{field.label}</IonLabel>
                  <IonInput
                    value={(form as any)[field.key]}
                    onIonChange={(e) =>
                      setForm({ ...form, [field.key]: e.detail.value! })
                    }
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
                    onIonChange={(e) =>
                      setForm({ ...form, [nutrient]: e.detail.value })
                    }
                  >
                    <IonSelectOption value="L">Low</IonSelectOption>
                    <IonSelectOption value="M">Medium</IonSelectOption>
                    <IonSelectOption value="H">High</IonSelectOption>
                  </IonSelect>
                </IonItem>
              ))}

              <IonButton
                expand="block"
                color="success"
                onClick={handleSave}
                className="ion-margin-top"
              >
                Save
              </IonButton>
              <IonButton
                expand="block"
                color="medium"
                onClick={() => setShowModal(false)}
              >
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
