import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export async function getMatchById(id: string) {
  const docRef = doc(db, "games", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
}
