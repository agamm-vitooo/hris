import React, { useState, useEffect } from 'react';
import { getAuth, updateEmail, updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import ProfileForm from './ProfileForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // Mengambil data pengguna saat ini
    const fetchUserData = async () => {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        toast.error('User not found');
      }
      setLoading(false);
    };

    if (auth.currentUser) {
      fetchUserData();
    }
  }, [auth, db]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdateProfile = async (updatedData) => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, updatedData);

      // Update nama pengguna di Firebase Authentication (jika ada perubahan)
      if (updatedData.name && updatedData.name !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: updatedData.name });
      }

      // Update email (jika ada perubahan)
      if (updatedData.email && updatedData.email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, updatedData.email);
      }

      toast.success('Profile updated successfully!');
      setUserData({ ...userData, ...updatedData });
      setIsEditing(false);
    } catch (error) {
      toast.error('Error updating profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Edit Profile</h1>

      {userData && (
        <ProfileForm
          userData={userData}
          isEditing={isEditing}
          handleUpdateProfile={handleUpdateProfile}
          handleEditToggle={handleEditToggle}
          loading={loading}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default ProfilePage;
