import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Filters from "./Filter";
import AttendanceList from "./AttendanceList";
import PDFDownload from "./PDFDownload";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // Import Leaflet components

const AttendanceAdmin = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [mapCenter, setMapCenter] = useState([0, 0]); // Default map center
  const db = getFirestore();

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [dateFilter, statusFilter, attendanceData]);

  const fetchAttendanceData = async () => {
    try {
      const attendanceCollection = collection(db, "attendance");
      const attendanceSnapshot = await getDocs(attendanceCollection);
  
      if (attendanceSnapshot.empty) {
        console.log("No attendance data found.");
      }
  
      const attendanceList = await Promise.all(
        attendanceSnapshot.docs.map(async (docSnapshot) => {
          const attendance = { id: docSnapshot.id, ...docSnapshot.data() };
  
          if (!attendance.userID) {
            console.error("User ID is missing for attendance entry", attendance);
            return null; // Skip this entry if no userID
          }
  
          // Ambil data pengguna dari Firestore
          const userDocRef = doc(db, "users", attendance.userID);
          const userDoc = await getDoc(userDocRef);
  
          // Cek apakah dokumen pengguna ada
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userName = userData.name || "Unknown"; // Jika name tidak ada, fallback ke "Unknown"
            return { ...attendance, name: userName };
          } else {
            console.error("User document not found for userID:", attendance.userID);
            return { ...attendance, name: "Unknown" }; // Fallback jika tidak ada data pengguna
          }
        })
      );
  
      const validAttendanceList = attendanceList.filter(item => item !== null);
  
      if (validAttendanceList.length > 0) {
        const sortedAttendanceList = validAttendanceList.sort((a, b) =>
          new Date(b.date) - new Date(a.date) // Sort by date (newest first)
        );
        setAttendanceData(sortedAttendanceList);
      } else {
        console.log("Attendance data is empty.");
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      toast.error("Failed to fetch attendance data.");
    }
  };  

  const applyFilters = () => {
    let filtered = attendanceData;

    if (dateFilter) {
      filtered = filtered.filter((attendance) =>
        attendance.date.includes(dateFilter)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (attendance) => attendance.status === statusFilter
      );
    }

    setFilteredData(filtered);

    // Update map center based on filtered data (first user's location)
    if (filtered.length > 0 && filtered[0].location) {
      const location = filtered[0].location;

      if (typeof location === "string") {
        const [lat, lng] = location.split(", ");
        setMapCenter([parseFloat(lat), parseFloat(lng)]);
      } else if (typeof location === "object" && location.lat && location.lng) {
        setMapCenter([location.lat, location.lng]);
      }
    }
  };

  const handleMarkAbsent = async (id) => {
    try {
      const attendanceDoc = doc(db, "attendance", id);
      await updateDoc(attendanceDoc, { status: "Absent" });
      toast.success("User marked as absent!");
      fetchAttendanceData();
    } catch (error) {
      toast.error("Failed to mark user as absent.");
      console.error("Error marking absent:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Attendance Management</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-0 mb-6">
        <Filters
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <PDFDownload dateFilter={dateFilter} filteredData={filteredData} />
      </div>

      <div className="overflow-x-auto mb-6">
        <AttendanceList
          filteredData={filteredData}
          handleMarkAbsent={handleMarkAbsent}
        />
      </div>
    </div>
  );
};

export default AttendanceAdmin;
