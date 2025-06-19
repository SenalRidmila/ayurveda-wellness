import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from '../config/firebase'; // Changed import

export const register = async (email, password) => {
  try {
    const auth = getFirebaseAuth(); // Get auth instance
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const auth = getFirebaseAuth(); // Get auth instance
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
};
