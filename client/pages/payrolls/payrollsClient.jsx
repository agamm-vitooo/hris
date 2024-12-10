import React, { useState, useEffect } from 'react';
import { db } from '../../../src/server/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';

const PayrollsClient = ({ userID }) => {
  const [userPayrolls, setUserPayrolls] = useState([]); 
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch payrolls for the selected user (userID)
    const fetchUserPayrolls = async () => {
      try {
        // Get user details to show user name
        const userRef = collection(db, 'users');
        const userSnapshot = await getDocs(query(userRef, where('id', '==', userID)));
        
        if (!userSnapshot.empty) {
          setUserName(userSnapshot.docs[0].data().name);
        } else {
          toast.error('User not found');
          return;
        }

        const payrollRef = collection(db, 'payrolls');
        const q = query(payrollRef, where('userID', '==', userID)); // Filter payrolls by userID
        const querySnapshot = await getDocs(q);
        const payrollList = [];

        querySnapshot.forEach((doc) => {
          payrollList.push({ id: doc.id, ...doc.data() });
        });

        setUserPayrolls(payrollList); // Save payrolls data for the selected user
      } catch (error) {
        console.error('Error fetching user payrolls:', error);
        toast.error('Failed to load payrolls!');
      } finally {
        setLoading(false); // Set loading to false after the fetch is done
      }
    };

    if (userID) {
      fetchUserPayrolls();
    }
  }, [userID]); // Re-run when userID changes

  // If loading, show a loading message
  if (loading) {
    return <div className="text-center">Loading payroll data...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">Payrolls for {userName}</h1>

      {/* Display payrolls for the selected user */}
      {userPayrolls.length > 0 ? (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-primary mb-2">Payroll History</h3>
          <ul className="space-y-2">
            {userPayrolls.map((payroll) => (
              <li key={payroll.id} className="bg-gray-100 p-4 rounded-lg border border-gray-300 text-primary">
                <div><strong>Basic Salary:</strong> {payroll.basicSalary}</div>
                <div><strong>Total Allowances:</strong> {payroll.totalAllowance}</div>
                <div><strong>Total Deductions:</strong> {payroll.totalDeductions}</div>
                <div><strong>Total Salary:</strong> {payroll.totalSalary}</div>
                {/* Handle Firebase timestamp properly */}
                <div><strong>Created At:</strong> {new Date(payroll.createdAt.seconds * 1000).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-primary">No payroll records found for this user.</div>
      )}
    </div>
  );
};

export default PayrollsClient;
