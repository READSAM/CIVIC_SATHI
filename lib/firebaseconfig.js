// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2EWBBL9x0F4wC2SRlqyN6C8nY9qZUtAw",
  authDomain: "civicawareness-53e58.firebaseapp.com",
  projectId: "civicawareness-53e58",
  storageBucket: "civicawareness-53e58.firebasestorage.app",
  messagingSenderId: "726721172844",
  appId: "1:726721172844:web:04cf2c76ea0be339c60f49",
  measurementId: "G-ES3JZR9LRN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);