import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBHFsMHUPZ5WlBMVNx2wJ6qxgY0usV-nQo",
  authDomain: "fir-course-785f8.firebaseapp.com",
  projectId: "fir-course-785f8",
  storageBucket: "fir-course-785f8.appspot.com",
  messagingSenderId: "321998834164",
  appId: "1:321998834164:web:c5f3f45f8d6be9c1f951a1",
  measurementId: "G-VLFS0F60YT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);