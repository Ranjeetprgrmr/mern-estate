// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-a02bc.firebaseapp.com",
  projectId: "mern-estate-a02bc",
  storageBucket: "mern-estate-a02bc.firebasestorage.app",
  messagingSenderId: "475255519631",
  appId: "1:475255519631:web:c6a5ac65fead4ecddc33fa"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);