import React, { useEffect, useState } from 'react';

import { initializeApp } from 'firebase/app';

import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';



// Firebase config from your Firebase console

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

const auth = getAuth(app);

const provider = new GoogleAuthProvider();



function App() {

 const [user, setUser] = useState(null);



 useEffect(() => {

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

   setUser(currentUser);

  });

  return () => unsubscribe();

 }, []);



 const handleLogin = () => {

  signInWithPopup(auth, provider)

   .then((result) => {

    setUser(result.user);

   })

   .catch((error) => {

    console.error('Login Error:', error);

   });

 };



 const handleLogout = () => {

  signOut(auth)

   .then(() => setUser(null))

   .catch((error) => console.error('Logout Error:', error));

 };



 return (

  <div style={{ textAlign: 'center', marginTop: '100px' }}>

   <h1>🎵 Welcome to Music App</h1>

   {user ? (

    <>

     <p>Signed in as: {user.displayName}</p>

     <img src={user.photoURL} alt="Profile" style={{ borderRadius: '50%', height: '100px' }} />

     <br />

     <button onClick={handleLogout}>Logout</button>

    </>

   ) : (

    <button onClick={handleLogin}>Sign in with Google</button>

   )}

  </div>

 );

}



export default App;





















































 























































