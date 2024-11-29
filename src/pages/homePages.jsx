import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../server/firebase';
import UserChart from './UserPages/userChart';
import heroImage from "../assets/hero.png";

const HomePages = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Simulasi pengguna yang login

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const userCollection = collection(db, 'users');
      const userSnapshot = await getDocs(userCollection);
      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);

      const loggedInUser = userList[0];
      setCurrentUser(loggedInUser);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Determine time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 18) return 'Selamat Siang';
    return 'Selamat Malam';
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 bg-slate-50 text-gray-800 ">
      <div className="hero flex flex-wrap-reverse justify-start items-center">
        <div className="text">
          <h1 className="text-2xl font-bold">
            {currentUser
              ? `${getGreeting()}, ${currentUser.name}👋`
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
