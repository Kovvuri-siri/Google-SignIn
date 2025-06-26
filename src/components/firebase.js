// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXGMR30DzPrVUx6jeQNUvcTqVLr9aIotY",
  authDomain: "react-ae076.firebaseapp.com",
  projectId: "react-ae076",
  storageBucket: "react-ae076.firebasestorage.app",
  messagingSenderId: "565501172352",
  appId: "1:565501172352:web:dd7ac223f30280d654a465",
  measurementId: "G-FJ4CN2LG3T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);