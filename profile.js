import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";

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
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ DOM Elements
const profileBtn = document.getElementById("profile-btn");
const profileSection = document.getElementById("profile-section");
const logoutBtn = document.getElementById("logout-btn");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const userBirthday = document.getElementById("user-birthday");
const profilePic = document.getElementById("profile-pic");
const profilePicUpload = document.getElementById("profile-pic-upload");
const saveProfileBtn = document.getElementById("save-profile");

// ✅ Fetch user data
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            userName.value = userData.name || "";
            userEmail.value = userData.email || "";
            userBirthday.value = userData.birthday || "";
            profilePic.src = userData.profilePic || "default-profile.png";
        } else {
            console.log("User not found in Firestore.");
        }
    } else {
        window.location.href = "index.html";
    }
});

// ✅ Show Profile Section
profileBtn.addEventListener("click", () => {
    profileSection.classList.toggle("hidden");
});

// ✅ Handle Profile Picture Upload (🔥 Fix)
profilePicUpload.addEventListener("change", async (event) => {
    const file = event.target.files[0];

    if (file) {
        const user = auth.currentUser;
        const storageRef = ref(storage, `profile_pics/${user.uid}`); // ✅ Store in Firebase Storage
        await uploadBytes(storageRef, file);
        const profilePicURL = await getDownloadURL(storageRef);

        console.log("Profile Picture URL:", profilePicURL); // Debugging

        // ✅ Update profile picture in Firestore
        await setDoc(doc(db, "users", user.uid), { profilePic: profilePicURL }, { merge: true });

        // ✅ Update profile picture in Firebase Auth
        await updateProfile(user, { photoURL: profilePicURL });

        // ✅ Update UI
        profilePic.src = profilePicURL;
        alert("Profile picture updated successfully!");
    }
});

// ✅ Save Profile Updates
saveProfileBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (user) {
        await setDoc(doc(db, "users", user.uid), { 
            name: userName.value,
            birthday: userBirthday.value 
        }, { merge: true });

        // ✅ Update name in Firebase Auth
        await updateProfile(user, { displayName: userName.value });

        alert("Profile updated successfully!");
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const goBackBtn = document.getElementById("go-back-btn");

    if (goBackBtn) {
        goBackBtn.addEventListener("click", () => {
            if (document.referrer) {
                window.history.back(); // Navigate to the previous page
            } else {
                window.location.href = "index.html"; // Redirect to a fallback page
            }
        });
    }
});


// ✅ Logout Function
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
});

