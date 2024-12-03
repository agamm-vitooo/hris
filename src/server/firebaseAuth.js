// src/firebaseAuth.js
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from './firebase';

// Atur persistence untuk Firebase
setPersistence(auth, browserLocalPersistence) // Menggunakan localStorage untuk persistensi sesi
    .catch((error) => {
        console.error("Error setting persistence:", error);
    });

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

// Memantau status autentikasi pengguna secara real-time
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user);
    } else {
        console.log("No user is logged in.");
    }
});

export default auth;