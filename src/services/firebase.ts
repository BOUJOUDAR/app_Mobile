import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// REPLACE THESE WITH YOUR FIREBASE CONFIG
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select an existing one
// 3. Click the Web icon (</>) to create a new app
// 4. Copy the "firebaseConfig" object and paste it here
const firebaseConfig = {
    apiKey: "AIzaSyC1pC58gt7EPLya5U3Y9nRkLfncJsIB_Z0",
    authDomain: "applovely-997fd.firebaseapp.com",
    projectId: "applovely-997fd",
    storageBucket: "applovely-997fd.firebasestorage.app",
    messagingSenderId: "526515219294",
    appId: "1:526515219294:web:3de9d29647fbb14207bdcf",
    measurementId: "G-BQRH5LC9SW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
