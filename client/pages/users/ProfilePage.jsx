import React, { useState, useEffect } from "react";
import { db } from "../../../src/server/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";

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
      
      // Find current logged in user
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
      // Update the current user's data
      if (currentUser) {
        await updateDoc(doc(db, "users", currentUser.id), formData);
        toast.success("Profile updated successfully!");
        fetchUsers(); // Refresh user list
      }
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return <div className="text-center text-lg">Loading...</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-indigo-200">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-primary mb-6">Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-gray-700">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-2 p-3 w-full border bg-gray-100 text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
              className="mt-2 p-3 w-full bg-gray-100 text-gray-800 border border-gray-300 rounded-lg cursor-not-allowed"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-lg font-medium text-gray-700">Phone</label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-2 p-3 w-full bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Department Field */}
          <div>
            <label htmlFor="department" className="block text-lg font-medium text-gray-700">Department</label>
            <input
              id="department"
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="mt-2 p-3 w-full border bg-gray-100 text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Position Field */}
          <div>
            <label htmlFor="position" className="block text-lg font-medium text-gray-700">Position</label>
            <input
              id="position"
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="mt-2 p-3 w-full border bg-gray-100 text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center text-primary">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-800 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default ProfilePage;
