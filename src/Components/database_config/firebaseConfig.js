import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyAS_oLN8hLCy-9D4jL1trZQCgvqbPWt840",
    authDomain: "delivery-agency.firebaseapp.com",
    projectId: "delivery-agency",
    storageBucket: "delivery-agency.appspot.com",
    messagingSenderId: "1030596775131",
    appId: "1:1030596775131:web:156823449bcb1c018dd0fe",
    measurementId: "G-8FP6CNYVLQ"
};


const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getDatabase(app);