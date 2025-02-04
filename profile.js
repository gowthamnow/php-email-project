// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCjoTQ1uJjLz8nPvjn2EIyR25kYyhRyM-4",
    authDomain: "website-1052c.firebaseapp.com",
    projectId: "website-1052c",
    storageBucket: "website-1052c.appspot.com",
    messagingSenderId: "713849165748",
    appId: "1:713849165748:web:07c52134043be31c2384e1",
    measurementId: "G-50SFS9ZJ0V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const userBirthday = document.getElementById("user-birthday");
const profilePic = document.getElementById("profile-pic");
const editProfileBtn = document.getElementById("edit-profile");
const logoutBtn = document.getElementById("logout-btn");

// Fetch User Data
// Fetch User Data
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            userName.textContent = userData.name || "No Name";
            userEmail.textContent = user.email;
            userBirthday.textContent = userData.birthday || "Not Set";
            
            // Check if profilePic exists
            if (userData.profilePic) {
                profilePic.src = userData.profilePic;
                console.log("Profile Pic Loaded:", userData.profilePic);
            } else {
                profilePic.src = "default-profile.png"; // Fallback
            }
        } else {
            console.log("User data not found.");
        }
    } else {
        window.location.href = "index.html"; // Redirect to login page
    }
});


// Redirect to Edit Profile Page
editProfileBtn.addEventListener("click", () => {
    window.location.href = "edit.html";
});

// Logout Function
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html"; // Redirect to login page
});
