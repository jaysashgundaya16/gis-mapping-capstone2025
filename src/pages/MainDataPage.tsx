import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc
} from "firebase/firestore";

export default function MainDataPage() {
  const [data, setData] = useState<{ id: string; [key: string]: any }[]>([]);

  useEffect(() => {
    loadMainData();
  }, []);

  const loadMainData = async () => {
    const querySnapshot = await getDocs(collection(db, "yourMainCollectionName"));
    const items: { id: string; [key: string]: any }[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    setData(items);
  };

  // ------------------------------------
  // ARCHIVE FUNCTION (DELETE button)
  // ------------------------------------
  const handleArchive = async (id: string, item: { id: string; [key: string]: any }) => {
    const archiveRef = doc(db, "archives", id);
    const mainRef = doc(db, "soilTests", id);

    // Copy → archives
    await setDoc(archiveRef, {
      ...item,
      archivedAt: new Date(),
    });

    // Delete → main data
    await deleteDoc(mainRef);

    // Refresh UI
    loadMainData();
  };

  return (
    <div>
      <h1>Main Data</h1>

      {data.map((item) => (
        <div
          key={item.id}
          style={{
            padding: "10px",
            margin: "10px 0",
            border: "1px solid #ccc",
          }}
        >
          <p>{item.name}</p>

          {/* ARCHIVE BUTTON */}
          <button onClick={() => handleArchive(item.id, item)}>
            Archive
          </button>
        </div>
      ))}
    </div>
  );
}
