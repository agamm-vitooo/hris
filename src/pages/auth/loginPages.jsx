import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../server/firebase'; // Ensure you've imported Firebase database

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [isLoading, setIsLoading] = useState(false); // State to manage loading
    const navigate = useNavigate();
    const auth = getAuth();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);  // Start loading

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user; // Firebase Authentication UID
            
            // Query Firestore to find the user document with userID that matches the Firebase UID
            const q = query(collection(db, 'users'), where('userID', '==', user.uid));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                toast.error("Pengguna tidak ditemukan di database");
                return;
            }

            // If user found, proceed with the login
            toast.success("Berhasil login!");
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                const isAdmin = userData.role === 'Admin';
                if (isAdmin) {
                    navigate('/Home');
                } else {
                    navigate('/Dashboard');
                }
            });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);  // End loading
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Toggle the password visibility
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-green-600 text-center mb-4">Login</h1>
                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}  // Change type based on showPassword state
                            placeholder="Password"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 bg-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}  {/* Toggle the eye icon */}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
                        disabled={isLoading}  // Disable button while loading
                    >
                        {isLoading ? 'Loading...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
