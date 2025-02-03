import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";

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

// DOM Elements
const registrationForm = document.getElementById('registration-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Handle Registration
registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // Update the user's profile with their name
        await updateProfile(user, { displayName: name });

        // Redirect back to the login page after successful registration
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Error during registration. Please try again.');
    }
});
