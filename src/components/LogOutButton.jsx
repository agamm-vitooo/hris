import React from 'react';
import { logOut } from '../server/firebaseAuth';

const Logout = () => {
    const handleLogout = async () => {
        try {
            await logOut();
            alert('Logged out successfully');
        } catch (error) {
            alert(error.message);
        }
    };

    return <button onClick={handleLogout}>Log Out</button>;
};

export default Logout;
