import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../server/firebase';
import UserChart from './UserPages/userChart';
import heroImage from "../assets/hero.png";

const HomePages = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const auth = getAuth();

    // Mengambil data pengguna dari Firestore
    const fetchUsers = async () => {
        try {
            const userCollection = collection(db, 'users');
            const userSnapshot = await getDocs(userCollection);
            const userList = userSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(userList);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    // Mengambil sapaan berdasarkan waktu
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 18) return 'Selamat Siang';
        return 'Selamat Malam';
    };

    // Mengecek status pengguna yang sedang login
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            navigate('/login');  // Arahkan ke login jika belum login
        } else {
            setCurrentUser(user);
            fetchUsers();  // Ambil data pengguna jika sudah login
        }
    }, [auth, navigate]);

    if (loading) {
        return <div>Loading...</div>; // Menampilkan loading sementara data pengguna dimuat
    }

    return (
        <div className="p-4 bg-slate-50 text-gray-800">
            <div className="hero flex flex-wrap-reverse justify-start items-center">
                <div className="text">
                    <h1 className="text-2xl font-bold">
                        {currentUser
                            ? `${getGreeting()}, ${currentUser.displayName || currentUser.name} 👋`
                            : 'Welcome to HRIS Dashboard'}
                    </h1>
                    <p>Here are the statistics from the user data.</p>
                </div>
                {/* <img src={heroImage} alt="hero" className='w-80 h-full' /> */}
            </div>
            <div className="mt-6">
                <UserChart users={users} />
            </div>
        </div>
    );
};

export default HomePages;
