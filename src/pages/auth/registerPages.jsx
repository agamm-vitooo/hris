import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from 'react-icons/fc'; // Google Icon
import { BsPhone } from 'react-icons/bs'; // Phone Icon

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();

    const handleEmailRegister = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            toast.success("User registered successfully!");
            navigate('/Login');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleGoogleRegister = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            toast.success(`Welcome, ${user.displayName}!`);
            navigate('/Home');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-blue-600 text-center mb-4">Register</h1>
                <form onSubmit={handleEmailRegister} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                    >
                        Register
                    </button>
                </form>

                <div className="flex justify-center space-x-4 mt-6">
                    {/* Google Register */}
                    <button
                        onClick={handleGoogleRegister}
                        className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition duration-200"
                    >
                        <FcGoogle size={28} />
                    </button>

                    {/* Phone Register */}
                    <button
                        onClick={() => navigate('/PhoneAuth')}
                        className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition duration-200"
                    >
                        <BsPhone size={28} className="text-yellow-500" />
                    </button>
                </div>

                <p className="text-center text-gray-600 mt-4">
                    Already have an account?{' '}
                    <span
                        onClick={() => navigate('/Login')}
                        className="text-blue-500 hover:underline cursor-pointer"
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;
