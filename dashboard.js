import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";

const auth = getAuth();
const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        alert("Logged out successfully!");
        window.location.href = "index.html"; // Redirect to login page
    }).catch((error) => {
        console.error("Logout error:", error);
    });
});
