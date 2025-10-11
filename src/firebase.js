// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCytgPed2POBkrNDD7QnLbmWkFLosAs-K4",
  authDomain: "my-yellowish-app.firebaseapp.com",
  projectId: "my-yellowish-app",
  storageBucket: "my-yellowish-app.firebasestorage.app",
  messagingSenderId: "1037385317925",
  appId: "1:1037385317925:web:7c9e42004cf9a59d0689cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
