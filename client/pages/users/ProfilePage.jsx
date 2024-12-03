import React, { useState, useEffect } from "react";
import { db } from "../../../src/server/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { getAuth, updatePassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import ProfileForm from "./ProfileForm"; // Import komponen ProfileForm

const ProfilePage = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const userCollection = collection(db, "users");
      const userSnapshot = await getDocs(userCollection);
      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);

      // Find current logged-in user
      const loggedUser = userList.find((user) => user.userID === auth.currentUser?.uid);
      if (loggedUser) {
        setCurrentUser(loggedUser);
        setFormData(loggedUser); // Pre-fill form with current user data
      }
    } catch (error) {
      toast.error("Error fetching users!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentUser) {
        // Update the current user's data (except password)
        const updatedData = { ...formData };
        
        // If a new password is provided, update both Firestore and Firebase Authentication
        if (formData.newPassword) {
          // Update password in Firestore
          updatedData.password = formData.newPassword; // Set new password to form data for Firestore update

          // Update password in Firebase Authentication
          await updatePassword(auth.currentUser, formData.newPassword);
          toast.success("Password updated successfully in Firebase Authentication.");
        }

        // Update user profile in Firestore
        await updateDoc(doc(db, "users", currentUser.id), updatedData);

        toast.success("Profile updated successfully!");
        fetchUsers(); // Refresh user list
      }
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || !formData) return <div className="text-center text-lg">Loading...</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-indigo-200">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-primary mb-6">Profile</h1>

        {/* Use the ProfileForm component */}
        <ProfileForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />

        <ToastContainer />
      </div>
    </div>
  );
};

export default ProfilePage;
