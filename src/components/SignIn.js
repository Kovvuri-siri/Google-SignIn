// src/components/SignIn.js
import React from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

function SignIn() {
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("User Info:", result.user);
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
      });
  };

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign In with Google</button>
    </div>
  );
}

export default SignIn;