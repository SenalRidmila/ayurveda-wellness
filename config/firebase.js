import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZCNvCJC_swePe7aJyyuD4bWncoyp3Xow",
  authDomain: "ayurvedawellnssapp.firebaseapp.com",
  projectId: "ayurvedawellnssapp",
  storageBucket: "ayurvedawellnssapp.appspot.com",
  messagingSenderId: "686252877880",
  appId: "1:686252877880:web:fc6588586ef0f375f15ecd",
  measurementId: "G-NLZ0YS0TLE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
