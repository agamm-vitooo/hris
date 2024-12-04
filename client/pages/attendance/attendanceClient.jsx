import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Default coordinates for Yogyakarta
const DEFAULT_COORDINATES = [-7.7956, 110.3695];

const AttendanceClient = () => {
  const [status, setStatus] = useState(""); // Status of attendance (e.g., "Present", "Absent")
  const [date, setDate] = useState(""); // Date of attendance
  const [location, setLocation] = useState(""); // Geolocation of the user
  const [name, setName] = useState(""); // User's name
  const [isLoading, setIsLoading] = useState(false); // Loading state for the button and form
  const db = getFirestore();
  const auth = getAuth();

  // Custom component to capture user's location on the map
  const LocationMarker = () => {
    const map = useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng;
        setLocation(`Latitude: ${lat}, Longitude: ${lng}`);
      },
    });

    return (
      <Marker position={DEFAULT_COORDINATES}>
        <Popup>Click on the map to set your location.</Popup>
      </Marker>
    );
  };

  useEffect(() => {
    // Set today's date on page load
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    setDate(today);

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
  }, [auth, db]);

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
        name,
        date,
        status,
        location,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "attendance"), newAttendance);
      toast.success("Attendance marked successfully!");
      setStatus(""); // Reset status after submission
      setLocation(""); // Reset location after submission
    } catch (error) {
      toast.error("Failed to mark attendance.");
      console.error("Error marking attendance:", error);
    } finally {
      setIsLoading(false); // Reset loading state after submission completes
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

        {/* Leaflet Map */}
        <div className="h-64">
          <MapContainer center={DEFAULT_COORDINATES} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />
          </MapContainer>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
          disabled={isLoading || !status || !location}
        >
          {isLoading ? (
            <span className="animate-spin">⏳</span> // Loading spinner
          ) : (
            "Mark Attendance"
          )}
        </button>
      </form>
    </div>
  );
};

export default AttendanceClient;
