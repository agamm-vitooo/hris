import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

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
        <div>
            <h1 className='text-black'>Selamat datang di Dashboard User</h1>
        </div>
    );
};

export default Dashboard;
