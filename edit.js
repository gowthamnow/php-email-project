// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";

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
const storage = getStorage(app);

// DOM Elements
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const userBirthday = document.getElementById("user-birthday");
const profilePic = document.getElementById("profile-pic");
const profilePicUpload = document.getElementById("profile-pic-upload");
const saveProfileBtn = document.getElementById("save-profile");
const goBackBtn = document.getElementById("go-back");

// Fetch User Data
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            userName.value = userData.name || "";
            userEmail.value = user.email || "";
            userBirthday.value = userData.birthday || "";
            profilePic.src = userData.profilePic || "default-profile.png";
        } else {
            console.log("User data not found.");
        }
    } else {
        window.location.href = "index.html"; // Redirect to login page
    }
});

// Save Profile Updates
saveProfileBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (user) {
        try {
            await setDoc(doc(db, "users", user.uid), {
                name: userName.value,
                birthday: userBirthday.value
            }, { merge: true });

            await updateProfile(user, { displayName: userName.value });

            alert("Profile updated successfully!");
            window.location.href = "profile.html"; // Redirect back to profile view
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    }
});

/// Handle Profile Picture Upload
profilePicUpload.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
        const user = auth.currentUser;
        const storageRef = ref(storage, `profile_pics/${user.uid}`);

        try {
            // Upload Image
            await uploadBytes(storageRef, file);
            const profilePicURL = await getDownloadURL(storageRef);

            // Update Firestore
            await setDoc(doc(db, "users", user.uid), { profilePic: profilePicURL }, { merge: true });

            // Update Auth Profile
            await updateProfile(user, { photoURL: profilePicURL });

            // Update UI
            profilePic.src = profilePicURL;
            console.log("Updated Profile Picture:", profilePicURL);

            alert("Profile picture updated!");
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            alert("Failed to upload profile picture.");
        }
    }
});


// Go Back to Profile View
goBackBtn.addEventListener("click", () => {
    window.location.href = "profile.html";
});
