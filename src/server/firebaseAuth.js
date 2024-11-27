// src/firebaseAuth.js
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Fungsi untuk Sign Up
export const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

// Fungsi untuk Login
export const logIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// Fungsi untuk Logout
export const logOut = () => {
    return signOut(auth);
};

// Waktu terakhir aktivitas pengguna
let lastActivityTime = Date.now();

// Fungsi untuk memeriksa idle time dan logout otomatis setelah 5 menit
const checkIdleTime = () => {
    const currentTime = Date.now();
    const idleTime = (currentTime - lastActivityTime) / 1000; // Idle time dalam detik

    if (idleTime >= 300) { // 5 menit
        logOut()
            .then(() => {
                console.log("User logged out due to inactivity.");
                localStorage.removeItem("authUser"); // Hapus data login
                window.location.href = "/"; // Redirect ke halaman login
            })
            .catch((error) => {
                console.error("Error logging out:", error);
            });
    }
};

// Reset waktu idle saat pengguna melakukan aktivitas
const resetIdleTimer = () => {
    lastActivityTime = Date.now();
};

// Tambahkan event listener untuk mendeteksi aktivitas pengguna
window.addEventListener("mousemove", resetIdleTimer);
window.addEventListener("keydown", resetIdleTimer);

// Periksa waktu idle setiap 10 detik
setInterval(checkIdleTime, 10000); // Periksa setiap 10 detik

// Memantau status autentikasi pengguna secara real-time
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user);
    } else {
        console.log("No user is logged in.");
    }
});

export default auth;