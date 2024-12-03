// AttendanceClient.jsx
import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./loading";
import AttendanceForm from "./attendanceForm";
import PhotoUpload from "./photoUpload";
import LocationButton from "./locationButton";

const AttendanceClient = () => {
  const [status, setStatus] = useState("Present");
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      getDoc(userRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setUserName(docSnap.data().name);
          } else {
            setError("User data not found in Firestore");
            toast.error("User data not found in Firestore");
          }
        })
        .catch((error) => {
          setError("Failed to fetch user data");
          toast.error("Failed to fetch user data");
          console.error("Error getting user data:", error);
        })
        .finally(() => setLoading(false));
    } else {
      setError("User not authenticated");
      toast.error("User not authenticated");
      setLoading(false);
    }
  }, [auth, db]);

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    if (!userName) {
      toast.error("User name is not available");
      return;
    }

    try {
      await addDoc(collection(db, "attendance"), { name: userName, date, status });
      toast.success("Attendance marked successfully!");
    } catch (error) {
      toast.error("Failed to mark attendance.");
      console.error("Error marking attendance:", error);
    }
  };

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        // Send location data to backend or save in state
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Failed to get location");
      }
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Attendance Form</h1>
      <AttendanceForm
        date={date}
        setDate={setDate}
        status={status}
        setStatus={setStatus}
        handleAttendanceSubmit={handleAttendanceSubmit}
      />
      <PhotoUpload handlePhotoChange={() => {}} />
      <LocationButton handleGetLocation={handleGetLocation} error={error} />
      <ToastContainer />
    </div>
  );
};

export default AttendanceClient;
