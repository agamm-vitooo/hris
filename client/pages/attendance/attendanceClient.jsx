import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore"; // pastikan 'doc' diimpor di sini
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const AttendanceClient = () => {
  const [date, setDate] = useState(""); 
  const [status, setStatus] = useState(""); 
  const [location, setLocation] = useState(null); // Menyimpan lokasi sebagai objek { lat, lng }
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const db = getFirestore(); 

  // Mendapatkan lokasi perangkat menggunakan Geolocation API
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
  }, []);

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
      // Pastikan nama pengguna diambil dari Firestore jika displayName tidak ada
      const user = auth.currentUser;
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      
      const userName = userData.name || user.displayName || "Anonymous"; // fallback to "Anonymous" if both are undefined
  
      const attendanceData = {
        userID: user.uid,
        name: userName,  // Gunakan nama yang diambil dari Firestore
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
      setLocation(null); // Reset lokasi setelah submit
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
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
            center={location ? location : { lat: -6.2088, lng: 106.8456 }}  // Jika lokasi ada, gunakan lokasi tersebut
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
