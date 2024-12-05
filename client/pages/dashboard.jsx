import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import userIllustration from '../../src/assets/user_illustration.png'; // Mengimpor gambar

const Dashboard = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            navigate('/login');  // Arahkan ke login jika belum login
        } else {
            setCurrentUser(user);
        }
    }, [auth, navigate]);

    return (
        <div className="container mx-auto p-4 flex flex-col items-center">
            {/* Menampilkan ilustrasi */}
            <div className="flex justify-center mb-6">
                <img 
                    src={userIllustration} 
                    alt="User Illustration" 
                    className="w-24 sm:w-32 md:w-36 lg:w-20 xl:w-44 h-auto "
                />
            </div>
            
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-4">
                Selamat datang di Dashboard User
            </h1>

            {/* Menampilkan detail user jika ada */}
            {currentUser && (
                <div className="mt-4 text-center">
                    <p className="text-xl">Nama: {currentUser.displayName || 'User'}</p>
                    <p className="text-xl">Email: {currentUser.email}</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
