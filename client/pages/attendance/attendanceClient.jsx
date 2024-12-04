import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AttendanceClient = () => {
  const [status, setStatus] = useState(""); // Status of attendance (e.g., "Present", "Absent")
  const [date, setDate] = useState(""); // Date of attendance
  const [location, setLocation] = useState(""); // Geolocation of the user
  const [name, setName] = useState(""); // User's name
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    // Set current date on page load
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    setDate(today);

    // Fetch geolocation when the component loads
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
      });
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }

    // Fetch user data (name) from Firestore based on userID
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userQuery = query(collection(db, "users"), where("userID", "==", user.uid));
          const querySnapshot = await getDocs(userQuery);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              setName(userData.name); // Set name from Firestore
            });
          } else {
            toast.error("User not found in the database.");
          }
        }
      } catch (error) {
        toast.error("Failed to fetch user data.");
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true while submitting

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be logged in to mark attendance.");
        return;
      }

      // Create new attendance document in Firestore
      const newAttendance = {
        userID: user.uid,
        name, // Add name to the attendance document
        date,
        status,
        location,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "attendance"), newAttendance);
      toast.success("Attendance marked successfully!");
      setStatus(""); // Reset status after submission
    } catch (error) {
      toast.error("Failed to mark attendance.");
      console.error("Error marking attendance:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Attendance</h1>

      {/* Display user's name */}
      <p className="text-xl font-medium mb-4">Hello, {name ? name : "Loading..."}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            disabled={isLoading}
            required
          >
            <option value="">Select Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Current Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            disabled
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
          disabled={isLoading || !status}
        >
          {isLoading ? "Submitting..." : "Mark Attendance"}
        </button>
      </form>
    </div>
  );
};

export default AttendanceClient;
