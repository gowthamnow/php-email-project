import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";

import { 
    getAuth, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";

import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

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
const verifyEmailBtn = document.getElementById("verify-email");
const otpModal = document.getElementById("otpModal");
const closeModal = document.querySelector(".close-modal");
const otpDigits = document.querySelectorAll(".otp-digit");
const submitOtp = document.getElementById("submitOtp");
const resendOtp = document.getElementById("resendOtp");
const verificationStatus = document.getElementById("verification-status");
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
// Show OTP Modal
function showOtpModal() {
    otpModal.style.display = "flex";
    otpDigits[0].focus();
}

// Close Modal
closeModal.onclick = () => {
    otpModal.style.display = "none";
};

// OTP Input Handling
otpDigits.forEach((digit, index) => {
    digit.addEventListener("input", (e) => {
        if (e.target.value.length === 1 && index < 5) {
            otpDigits[index + 1].focus();
        }
    });

    digit.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && e.target.value === "" && index > 0) {
            otpDigits[index - 1].focus();
        }
    });
});

// Check if the user is authenticated
onAuthStateChanged(auth, (user) => {
    if (user) {
        verifyEmailBtn.addEventListener("click", async () => {
            console.log("UID:", user.uid); // Debugging log

            try {
                const response = await fetch("http://localhost:5000/send-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        uid: user.uid
                    })
                });

                const data = await response.json();
                if (!data.success) throw new Error("Failed to send OTP");

                showOtpModal(); // Show the OTP input modal
            } catch (error) {
                alert("Error: " + error.message);
            }
        });

        submitOtp.addEventListener("click", async () => {
            const enteredOtp = Array.from(otpDigits).map(d => d.value).join('');

            if (enteredOtp.length !== 6) {
                alert("Please enter a valid 6-digit OTP.");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/verify-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        uid: user.uid,
                        otp: enteredOtp
                    })
                });

                const data = await response.json();
                if (!data.success) throw new Error(data.error);

                // Update UI on successful verification
                verificationStatus.textContent = "Email Verified ✅";
                verifyEmailBtn.style.display = "none";
                otpModal.style.display = "none";

                // Force Firebase authentication state refresh
                await user.reload();
                alert("Email verified successfully!");
            } catch (error) {
                alert("Verification failed: " + error.message);
            }
        });

        resendOtp.addEventListener("click", async () => {
            try {
                const response = await fetch("http://localhost:5000/send-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        uid: user.uid
                    })
                });

                const data = await response.json();
                if (!data.success) throw new Error("Failed to resend OTP");

                alert("A new OTP has been sent to your email.");
            } catch (error) {
                alert("Error: " + error.message);
            }
        });
    } else {
        console.log("No user is signed in.");
    }
});
