import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, updateDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Filters from "./Filter";
import AttendanceList from "./AttendanceList";
import PDFDownload from "./PDFDownload";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const AttendanceAdmin = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const db = getFirestore();

  // Fetch attendance data using real-time listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "attendance"), (snapshot) => {
      const attendanceList = snapshot.docs.map((docSnapshot) => {
        const attendance = { id: docSnapshot.id, ...docSnapshot.data() };

        if (!attendance.userID) {
          console.error("User ID is missing for attendance entry", attendance);
          return null;
        }

        return attendance;
      }).filter(item => item !== null);

      setAttendanceData(attendanceList);
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, [db]);

  // Apply filters for date and status
  useEffect(() => {
    applyFilters();
  }, [dateFilter, statusFilter, attendanceData]);

  const applyFilters = () => {
    let filtered = attendanceData;
    if (dateFilter) filtered = filtered.filter(item => item.date === dateFilter);
    if (statusFilter) filtered = filtered.filter(item => item.status === statusFilter);
    setFilteredData(filtered);
  };

  // Fetch data from Firestore
  const fetchAttendanceData = async () => {
    try {
      const attendanceCollection = collection(db, "attendance");
      const attendanceSnapshot = await getDocs(attendanceCollection);

      const attendanceList = await Promise.all(
        attendanceSnapshot.docs.map(async (docSnapshot) => {
          const attendance = { id: docSnapshot.id, ...docSnapshot.data() };

          if (!attendance.userID) {
            console.error("User ID is missing for attendance entry", attendance);
            return null;
          }

          const userDocRef = doc(db, "users", attendance.userID);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            return { ...attendance, name: userData.name || "Unknown" };
          } else {
            return { ...attendance, name: "Unknown" };
          }
        })
      );

      setAttendanceData(attendanceList.filter(item => item !== null));
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      toast.error("Failed to fetch attendance data.");
    }
  };

  // Mark attendance as Absent, Approved, or Rejected
  const handleMarkMasuk = async (id) => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
  
    // Cek apakah waktu sekarang antara jam 6 pagi hingga 7 pagi
    if (hours >= 6 && hours < 7) {
      try {
        const attendanceDocRef = doc(db, "attendance", id);
        await updateDoc(attendanceDocRef, {
          status: "Absen Masuk",
          masukTime: currentTime.toISOString(),
        });
        fetchAttendanceData();  // refresh data
        toast.success("Marked as Absen Masuk");
      } catch (error) {
        toast.error("Failed to mark attendance as Absen Masuk");
      }
    } else {
      toast.error("Absen Masuk hanya dapat dilakukan antara jam 6 pagi hingga 7 pagi.");
    }
  };
  
  const handleMarkKeluar = async (id) => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
  
    // Cek apakah waktu sekarang antara jam 5 sore hingga 6 sore
    if (hours >= 17 && hours < 18) {
      try {
        const attendanceDocRef = doc(db, "attendance", id);
        await updateDoc(attendanceDocRef, {
          status: "Absen Keluar",
          keluarTime: currentTime.toISOString(),
        });
        fetchAttendanceData();  // refresh data
        toast.success("Marked as Absen Keluar");
      } catch (error) {
        toast.error("Failed to mark attendance as Absen Keluar");
      }
    } else {
      toast.error("Absen Keluar hanya dapat dilakukan antara jam 5 sore hingga 6 sore.");
    }
  };  

  const handleApprove = async (id) => {
    try {
      const attendanceDocRef = doc(db, "attendance", id);
      await updateDoc(attendanceDocRef, { status: "Approved" });
      fetchAttendanceData();
      toast.success("Attendance approved");
    } catch (error) {
      toast.error("Failed to approve attendance");
    }
  };

  const handleReject = async (id) => {
    try {
      const attendanceDocRef = doc(db, "attendance", id);
      await updateDoc(attendanceDocRef, { status: "Rejected" });
      fetchAttendanceData();
      toast.success("Attendance rejected");
    } catch (error) {
      toast.error("Failed to reject attendance");
    }
  };

  const handleMarkAbsent = async (id) => {
    try {
      const attendanceDocRef = doc(db, "attendance", id);
      await updateDoc(attendanceDocRef, { status: "Absent" });
      fetchAttendanceData();
      toast.success("Attendance marked as Absent");
    } catch (error) {
      toast.error("Failed to mark attendance as Absent");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Attendance Management</h1>

      <Filters
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <AttendanceList
        filteredData={filteredData}
        handleMarkAbsent={handleMarkAbsent}
        handleApprove={handleApprove}
        handleReject={handleReject}
        handleMarkMasuk={handleMarkMasuk}
        handleMarkKeluar={handleMarkKeluar}
      />

      <PDFDownload attendanceData={filteredData} />
    </div>
  );
};

export default AttendanceAdmin;
