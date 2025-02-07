import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCjoTQ1uJjLz8nPvjn2EIyR25kYyhRyM-4",
    authDomain: "website-1052c.firebaseapp.com",
    projectId: "website-1052c",
    storageBucket: "website-1052c.appspot.com",
    messagingSenderId: "713849165748",
    appId: "1:713849165748:web:07c52134043be31c2384e1",
    measurementId: "G-50SFS9ZJ0V"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// ✅ DOM Elements
const googleLoginBtn = document.getElementById("google-login-btn");

// ✅ Helper Functions
const showLoading = () => {
    googleLoginBtn.innerHTML = `<span class="spinner"></span> Signing in...`;
    googleLoginBtn.disabled = true;
};

const hideLoading = () => {
    googleLoginBtn.innerHTML = `Sign in with Google`;
    googleLoginBtn.disabled = false;
};

const showToast = (message, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
};

const saveUserToFirestore = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            profilePic: user.photoURL,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
        });
    } else {
        // Update last login time for existing users
        await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
    }
};

// ✅ Google Login Function
googleLoginBtn.addEventListener("click", async () => {
    try {
        showLoading();

        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        console.log("User Signed In:", user);

        // ✅ Save or update user in Firestore
        await saveUserToFirestore(user);

        // ✅ Show success message
        showToast("Signed in successfully! Redirecting...");

        // ✅ Redirect to main.html after a short delay
        setTimeout(() => {
            window.location.href = "main.html";
        }, 200);
    } catch (error) {
        console.error("Google Sign-In Error:", error.message);

        // ✅ Handle specific errors
        if (error.code === "auth/popup-closed-by-user") {
            showToast("Sign-in popup was closed. Please try again.", "error");
        } else if (error.code === "auth/network-request-failed") {
            showToast("Network error. Please check your internet connection.", "error");
        } else {
            showToast("Sign-in failed. Please try again.", "error");
        }
    } finally {
        hideLoading();
    }
});