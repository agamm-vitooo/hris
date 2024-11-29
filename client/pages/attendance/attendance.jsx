import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, GeoPoint, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AttendanceClient = ({ userId }) => {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const db = getFirestore();
  const storage = getStorage();

  // Fetch history on mount
  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const fetchHistory = async () => {
    try {
      const q = query(collection(db, "attendance"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const historyData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
        (error) => alert("Error getting location")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !photo || !location) {
      alert("All fields are required!");
      return;
    }
    setLoading(true);

    try {
      // Upload photo to Firebase Storage
      const photoRef = ref(storage, `photos/${Date.now()}_${photo.name}`);
      await uploadBytes(photoRef, photo);
      const photoURL = await getDownloadURL(photoRef);

      // Save attendance to Firestore
      await addDoc(collection(db, "attendance"), {
        userId,
        name,
        photo: photoURL,
        location: new GeoPoint(location.lat, location.lng),
        timestamp: new Date(),
      });

      alert("Attendance recorded successfully!");
      setName("");
      setPhoto(null);
      fetchHistory(); // Refresh history after submission
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to record attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-page">
      <h1>Attendance</h1>
      
      {/* Attendance Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Photo:</label>
          <input type="file" onChange={handleFileChange} required />
        </div>
        <div>
          <button type="button" onClick={handleLocation}>
            Get Location
          </button>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Attendance"}
        </button>
      </form>

      <hr />

      {/* Attendance History */}
      <h2>Attendance History</h2>
      <ul>
        {history.map((record) => (
          <li key={record.id}>
            <div>
              <strong>{record.name}</strong>
              <p>
                {new Date(record.timestamp.toDate()).toLocaleString()}
              </p>
              <img src={record.photo} alt="Attendance" width="50" />
              <p>
                Location: {record.location.latitude}, {record.location.longitude}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceClient;
