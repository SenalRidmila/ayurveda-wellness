import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/functions';
import 'firebase/compat/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtdXRG1Nd4riE8aLYVoZ9QuAGV1KoTUsI",
  authDomain: "ayurweda-wellness.firebaseapp.com",
  projectId: "ayurweda-wellness",
  storageBucket: "ayurweda-wellness.appspot.com",
  messagingSenderId: "535385039630",
  appId: "1:535385039630:web:df1409a7a2f0cbab08ed5f",
  measurementId: "G-92572PH5K8",
  databaseURL: "https://ayurweda-wellness-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
let firebaseApp;
if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} else {
  firebaseApp = firebase.app();
  console.log('Firebase already initialized');
}

// Initialize Firebase services
export const auth = firebase.auth();
export const db = firebase.firestore();
export const rtdb = firebase.database();
export const functions = firebase.functions();

// Enable offline persistence for Firestore with better error handling
try {
  db.enablePersistence({ synchronizeTabs: true })
    .then(() => {
      console.log('Firestore persistence enabled');
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence failed: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence not available in this browser');
      } else {
        console.error('Firestore persistence error:', err);
      }
    });
} catch (error) {
  console.warn('Could not enable Firestore persistence:', error);
}

// Use local emulator if in development mode
if (__DEV__) {
  // Uncomment these lines when you have set up Firebase emulators
  // functions.useEmulator('localhost', 5001);
  // db.useEmulator('localhost', 8080);
  // auth.useEmulator('http://localhost:9099');
  console.log('Running in development mode');
}

export default firebase; 