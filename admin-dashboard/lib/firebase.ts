import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration (same as the main app)
const firebaseConfig = {
  apiKey: "AIzaSyAtdXRG1Nd4riE8aLYVoZ9QuAGV1KoTUsI",
  authDomain: "ayurweda-wellness.firebaseapp.com",
  projectId: "ayurweda-wellness",
  storageBucket: "ayurweda-wellness.appspot.com",
  messagingSenderId: "535385039630",
  appId: "1:535385039630:web:df1409a7a2f0cbab08ed5f",
  measurementId: "G-92572PH5K8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export default app;
