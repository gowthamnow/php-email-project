const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-firebase-project.firebaseio.com"
});

const db = admin.firestore();
const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in Firestore
async function storeOTP(uid, otp) {
  const expires = new Date(Date.now() + 5 * 60000); // 5 minutes
  const otpRef = db.collection('users').doc(uid).collection('security').doc('otp');
  await otpRef.set({
    code: otp,
    expires: admin.firestore.Timestamp.fromDate(expires)
  });
}

app.post("/send-otp", async (req, res) => {
    const { email, uid } = req.body;
  
    if (!uid || !email) {
      return res.status(400).json({ success: false, error: "Missing UID or email" });
    }
  
    try {
      const otp = generateOTP();
      await storeOTP(uid, otp);
  
      await transporter.sendMail({
        from: `"Your App Name" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Verification OTP",
        html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #2563eb;">Email Verification</h2>
                <p>Your OTP code is: <strong>${otp}</strong></p>
                <p>This code will expire in 5 minutes.</p>
                <hr style="margin: 20px 0;">
                <p style="color: #666; font-size: 0.9rem;">If you didn't request this, please ignore this email.</p>
              </div>`
      });
  
      res.json({ success: true });
    } catch (error) {
      console.error("Send OTP Error:", error);
      res.status(500).json({ success: false, error: "Failed to send OTP" });
    }
  });
  

// Verify OTP
app.post("/verify-otp", async (req, res) => {
  const { uid, otp } = req.body;

  try {
    const otpRef = db.collection('users').doc(uid).collection('security').doc('otp');
    const doc = await otpRef.get();

    if (!doc.exists) throw new Error("OTP not found");

    const { code, expires } = doc.data();
    const now = admin.firestore.Timestamp.now();

    if (now.seconds > expires.seconds) throw new Error("OTP expired");
    if (otp !== code) throw new Error("Invalid OTP");

    // Update email verification status
    await admin.auth().updateUser(uid, { emailVerified: true });
    await otpRef.delete();

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));