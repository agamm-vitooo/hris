import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const syncUidWithUserID = async (auth, db) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("User is not authenticated");
    return;
  }

  const userDocRef = doc(db, "users", user.uid);
  const userDocSnapshot = await getDoc(userDocRef);

  if (!userDocSnapshot.exists()) {
    // Jika data pengguna belum ada, buat dokumen baru
    const userData = {
      userID: user.uid, 
      name: user.displayName || "Anonymous",
      email: user.email,
      phone: "",
      position: "",
      role: "User",
      status: "Active",
    };
    await addDoc(userDocRef, userData);
    console.log("User document created with userID: ", user.uid);
  } else {
    const userData = userDocSnapshot.data();
    if (userData.userID !== user.uid) {
      console.log("Syncing userID with uid...");
      await addDoc(userDocRef, { userID: user.uid }, { merge: true });
      console.log("UserID updated to match uid");
    }
  }
};

const AttendanceClient = () => {
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState(null); 
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Failed to get location.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }

    syncUidWithUserID(auth, db);
  }, [auth, db]);

  const LocationMarker = () => {
    const map = useMapEvent("click", (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setLocation({ lat, lng });
    });

    return location ? (
      <Marker position={location}>
        <Popup>
          Latitude: {location.lat} <br /> Longitude: {location.lng}
        </Popup>
      </Marker>
    ) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!date || !status || !location) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }
  
    try {
      const user = auth.currentUser;
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      const userName = userData.name || user.displayName || "Anonymous";
  
      const attendanceData = {
        userID: user.uid,
        name: userName,
        date: date,
        status: status,
        location: location,
        createdAt: new Date().toISOString(),
      };
  
      const attendanceCollectionRef = collection(db, "attendance");
      await addDoc(attendanceCollectionRef, attendanceData);
  
      toast.success("Attendance marked successfully!");
      setDate("");
      setStatus("");
      setLocation(null);
    } catch (error) {
      toast.error("Failed to mark attendance.");
      console.error("Error saving attendance:", error);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Mark Attendance</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 bg-gray-100"
            required
          >
            <option value="">Select Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        {/* Leaflet Map */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Location</label>
          <MapContainer
            center={location ? location : { lat: -6.2088, lng: 106.8456 }}
            zoom={12}
            style={{ width: "100%", height: "400px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
          </MapContainer>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Mark Attendance"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendanceClient;
