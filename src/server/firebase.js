// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Mengimpor Firestore
import { getAnalytics } from "firebase/analytics"; // Mengimpor Analytics

// Konfigurasi Firebase menggunakan variabel lingkungan
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Firebase Authentication
const auth = getAuth(app);

// Inisialisasi Firestore
const db = getFirestore(app); // Inisialisasi Firestore

// Inisialisasi Firebase Analytics jika measurementId tersedia
let analytics;
if (firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
}

// Fungsi helper untuk menyiapkan reCAPTCHA
const setUpRecaptcha = () => {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container", {
                size: "invisible", // Bisa diganti "normal" untuk reCAPTCHA yang terlihat
                callback: (response) => {
                    console.log("reCAPTCHA verified successfully!");
                },
                "expired-callback": () => {
                    console.error("reCAPTCHA expired. Please refresh the page.");
                },
            },
            auth
        );
    }
};

// Ekspor modul Firebase dan fungsi helper
export { app, auth, db, analytics, setUpRecaptcha };