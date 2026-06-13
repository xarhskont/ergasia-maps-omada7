// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyCpUQbgVxyCchmtIk0oPg3L5hR1tqUI4Hk',
    authDomain: 'ergasia-maps-omada7.firebaseapp.com',
    databaseURL: 'https://ergasia-maps-omada7-default-rtdb.firebaseio.com',
    projectId: 'ergasia-maps-omada7',
    storageBucket: 'ergasia-maps-omada7.firebasestorage.app',
    messagingSenderId: '455542577981',
    appId: '1:455542577981:web:227a4d5b9c00efa0930354',
    measurementId: 'G-8KRDGNRRR4'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app, analytics };
