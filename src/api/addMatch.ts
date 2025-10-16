import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

export async function addMatch(data: { left: string; right: string }) {
  try {
    const docRef = await addDoc(collection(db, "games"), data);
    console.log("Document written with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
}
