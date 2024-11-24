// src/firebaseAuth.js
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';

export const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const logIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
    return signOut(auth);
};

export default auth;