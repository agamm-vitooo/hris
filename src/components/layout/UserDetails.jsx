import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../server/firebase";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const fetchUserDetail = async () => {
    try {
      const userDoc = doc(db, "users", id);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        setUser(userSnapshot.data());
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  if (!user) {
    return (
      <div className="flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full h-full p-8">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-6 hover:bg-blue-600"
        >
          Back
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">{user.name}</h1>
          {user.profilePicture && (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
          )}
          <p className="text-gray-700 mb-2">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Phone:</strong> {user.phone}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Role:</strong> {user.role}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Department:</strong> {user.department}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Position:</strong> {user.position}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
