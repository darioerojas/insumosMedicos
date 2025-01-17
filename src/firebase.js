import { initializeApp } from 'firebase/app';
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBPCkgek3iGeu-ILO9XcFvFsGNm0Pmww6s",
    authDomain: "insumosmedicos-2f876.firebaseapp.com",
    projectId: "insumosmedicos-2f876",
    storageBucket: "insumosmedicos-2f876.firebasestorage.app",
    messagingSenderId: "279599758187",
    appId: "1:279599758187:web:d0ed4437507e827f58ea2e",
    measurementId: "G-2FJC49EWEX"
  };

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);