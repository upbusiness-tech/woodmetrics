import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { WoodPiece } from "../types/wood";

import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export interface Report {
  id?: string;
  date?: any;
  clientName: string;
  category: string;
  standardHeight: number;
  totalM2: number;
  totalM3: number;
  pieces: WoodPiece[];
}

export const firebaseService = {
  async saveReport(data: Report, user: any, userData: any) {
    const docRef = await addDoc(collection(db, "reports"), {
      ...data,
      date: new Date(),

      userId: user.uid,
      userName: userData?.name || "Sem nome",
      userRole: userData?.role || "Sem cargo",
    });

    return docRef.id;
  },

  getReports: async () => {
    const q = query(
      collection(db, "reports"),
      orderBy("date", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  register: async (email: string, password: string, name: string, role: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        role,
        email,
        createdAt: new Date(),
      });

      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  createUserIfNotExists: async (user: any) => {
    const docRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      const newUser = {
        name: user.email?.split("@")[0] || "Usuário",
        role: "Operador",
        email: user.email,
        createdAt: new Date(),
      };

      await setDoc(docRef, newUser);

      return newUser;
    }
    return snapshot.data();
  },

  getCurrentUserData: async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return null;

    return snapshot.data();
  },

  login: async (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Logado:", userCredential.user);
      })
      .catch((error) => {
        console.error(error.message);
      });
  },

  onAuthStateChanged(callback: (user: any) => void) {
    return onAuthStateChanged(auth, callback);
  },


  logout: async () => {
    signOut(auth);
  }
};