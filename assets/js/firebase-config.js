// firebase-config.js
// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpUQbgVxyCchmtIk0oPg3L5hR1tqUI4Hk",
  authDomain: "ergasia-maps-omada7.firebaseapp.com",
  projectId: "ergasia-maps-omada7",
  storageBucket: "ergasia-maps-omada7.firebasestorage.app",
  messagingSenderId: "455542577981",
  appId: "1:455542577981:web:227a4d5b9c00efa0930354",
  measurementId: "G-8KRDGNRRR4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
