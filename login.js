import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCjoTQ1uJjLz8nPvjn2EIyR25kYyhRyM-4",
    authDomain: "website-1052c.firebaseapp.com",
    projectId: "website-1052c",
    storageBucket: "website-1052c.firebasestorage.app",
    messagingSenderId: "713849165748",
    appId: "1:713849165748:web:07c52134043be31c2384e1",
    measurementId: "G-50SFS9ZJ0V"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google Login Function
document.getElementById("google-login-btn").addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        alert(`Welcome ${user.displayName}!`);
        window.location.href = "main.html"; // Redirect after login
    } catch (error) {
        console.error("Error during Google sign-in:", error.message);
        alert("Error during Google sign-in. Please try again.");
    }
});
