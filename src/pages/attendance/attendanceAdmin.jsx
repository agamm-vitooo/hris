import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Filters from "./filter";
import AttendanceList from "./attendanceList";
import PDFDownload from "./PDFDownload";

const AttendanceAdmin = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
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
      const attendanceList = attendanceSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortedAttendanceList = attendanceList.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );

      setAttendanceData(sortedAttendanceList);
    } catch (error) {
      toast.error("Failed to fetch attendance data.");
      console.error("Error fetching attendance data:", error);
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
      
      {/* Wrapper for Filters and PDF Download */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-0 mb-6">
        <Filters
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <PDFDownload dateFilter={dateFilter} filteredData={filteredData} />
      </div>

      {/* Attendance List Section */}
      <div className="overflow-x-auto">
        <AttendanceList
          filteredData={filteredData}
          handleMarkAbsent={handleMarkAbsent}
        />
      </div>
    </div>
  );
};

export default AttendanceAdmin;
