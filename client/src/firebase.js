// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "apartment-rent-abe63.firebaseapp.com",
  projectId: "apartment-rent-abe63",
  storageBucket: "apartment-rent-abe63.firebasestorage.app",
  messagingSenderId: "959497010354",
  appId: "1:959497010354:web:abd6116cd4dc6459de9dab",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
