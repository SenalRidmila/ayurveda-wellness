import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/functions';
import { Platform } from 'react-native';

// Firebase configuration
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
export const functions = firebase.functions();

// Configure Firestore settings
db.settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
  merge: true
});

// Enable offline persistence for Firestore with better error handling
// Only enable persistence on platforms that support it properly
const enableFirestorePersistence = async () => {
  // Skip persistence on web platforms
  if (Platform.OS === 'web') {
    console.log('Skipping Firestore persistence on web platform');
    return;
  }

  try {
    // Use cache settings instead of enablePersistence
    db.settings({
      cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
      merge: true
    });
    console.log('Firestore cache settings configured');
  } catch (err: any) {
    console.error('Firestore settings error:', err);
    // Fall back to memory cache
    console.log('Falling back to memory cache');
  }
};

// Initialize persistence
enableFirestorePersistence().catch(error => {
  console.warn('Error setting up Firestore persistence:', error);
});

// Use local emulator if in development mode
if (__DEV__) {
  // Uncomment these lines when you have set up Firebase emulators
  // functions.useEmulator('localhost', 5001);
  // db.useEmulator('localhost', 8080);
  // auth.useEmulator('http://localhost:9099');
  console.log('Running in development mode');
}

export default firebase; 