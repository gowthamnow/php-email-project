import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";

// Firebase Configuration
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

// Get elements
const registrationForm = document.getElementById('registration-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const birthdayInput = document.getElementById('birthday');
const profilePicInput = document.getElementById('profile-pic');
const previewImage = document.getElementById('preview-image');

// Get Google User Data from URL
const urlParams = new URLSearchParams(window.location.search);
const nameFromGoogle = urlParams.get('name');
const emailFromGoogle = urlParams.get('email');
const photoFromGoogle = urlParams.get('photo');

// Pre-fill form if Google data is available
if (nameFromGoogle) nameInput.value = decodeURIComponent(nameFromGoogle);
if (emailFromGoogle) emailInput.value = decodeURIComponent(emailFromGoogle);
if (photoFromGoogle) {
    previewImage.src = decodeURIComponent(photoFromGoogle);
    previewImage.style.display = "block";
}

// Handle Registration
registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value;
    const email = emailInput.value;
    const birthday = birthdayInput.value;
    const profilePicFile = profilePicInput.files[0];

    try {
        // Get the current authenticated user
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                let profilePicURL = photoFromGoogle; // Default to Google profile pic

                // If the user uploaded a new profile picture, upload to Firebase Storage
                if (profilePicFile) {
                    const storageRef = ref(storage, `profile_pics/${user.uid}`);
                    await uploadBytes(storageRef, profilePicFile);
                    profilePicURL = await getDownloadURL(storageRef);
                }

                // Update Firebase Auth profile
                await updateProfile(user, { displayName: name, photoURL: profilePicURL });

                // Save user data in Firestore
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name: name,
                    email: email,
                    birthday: birthday,
                    profilePic: profilePicURL
                });

                alert("Profile saved successfully!");
                window.location.href = "main.html";
            }
        });
    } catch (error) {
        console.error('Error saving profile:', error);
        alert("Error saving profile. Please try again.");
    }
});
