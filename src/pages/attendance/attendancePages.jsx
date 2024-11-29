import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const AttendanceAdmin = () => {
  const [attendance, setAttendance] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchAttendance = async () => {
      const querySnapshot = await getDocs(collection(db, "attendance"));
      setAttendance(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchAttendance();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Photo</th>
          <th>Location</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {attendance.map(record => (
          <tr key={record.id}>
            <td>{record.name}</td>
            <td><img src={record.photo} alt={record.name} width="50" /></td>
            <td>{record.location?.latitude}, {record.location?.longitude}</td>
            <td>{new Date(record.timestamp.toDate()).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AttendanceAdmin;
