import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../server/firebase";
import UserChart from './UserPages/userChart';

const HomePages = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const userCollection = collection(db, 'users');
      const userSnapshot = await getDocs(userCollection);
      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 bg-slate-50 text-gray-800">
      <h1 className="text-2xl font-bold">Welcome to HRIS Dashboard</h1>
      <p>Here are the statistics from the user data.</p>
      <div className="mt-6">
        <UserChart users={users} />
      </div>
    </div>
  );
};

export default HomePages;
