import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export async function addMatchResult(
  id: string,
  data: Partial<{
    left: string;
    right: string;
    leftScore: number;
    rightScore: number;
    scores: object;
    longestRally: number;
    finishedAt: string;
  }>
) {
  try {
    const docRef = await updateDoc(doc(db, "games", id), data);
    console.log("Document written with ID:", docRef);
    return docRef;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
}
