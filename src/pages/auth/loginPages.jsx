import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from 'react-icons/fc'; // Google Icon
import { BsPhone } from 'react-icons/bs'; // Phone Icon

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Logged in successfully!");
            navigate('/Home');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleGoogleLogin = async () => {
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
        <div className="min-h-screen flex items-center justify-center bg-green-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-green-600 text-center mb-4">Login</h1>
                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
                    >
                        Login
                    </button>
                </form>

                <div className="flex justify-center space-x-4 mt-6">
                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition duration-200"
                    >
                        <FcGoogle size={28} />
                    </button>

                    {/* Phone Login */}
                    <button
                        onClick={() => navigate('/PhoneAuth')}
                        className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition duration-200"
                    >
                        <BsPhone size={28} className="text-yellow-500" />
                    </button>
                </div>

                <p className="text-center text-gray-600 mt-4">
                    Don't have an account?{' '}
                    <span
                        onClick={() => navigate('/')}
                        className="text-green-500 hover:underline cursor-pointer"
                    >
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
