import React, { useState, useEffect } from 'react';
import { db } from '../../server/firebase'; // Import Firestore instance
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import FilterSection from './payrolls.filterSelection';
import UsersList from './payroll.userList';
import PayrollForm from './payrollsForm';

const PayrollsAdmin = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [payrollData, setPayrollData] = useState({
    basicSalary: '',
    transportAllowance: '',
    mealAllowance: '',
    healthAllowance: '',
    housingAllowance: '',
    incomeTax: '',
    socialSecurity: '',
    loanDeductions: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userRef = collection(db, 'users');
        const querySnapshot = await getDocs(userRef);
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const allRoles = [...new Set(usersList.map(user => user.role))];
        const allDepartments = [...new Set(usersList.map(user => user.department))];

        setRoles(allRoles);
        setDepartments(allDepartments);
        setUsers(usersList);
        setFilteredUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users data!');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (selectedRole) {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    if (selectedDepartment) {
      filtered = filtered.filter(user => user.department === selectedDepartment);
    }

    setFilteredUsers(filtered);
  }, [selectedRole, selectedDepartment, users]);

  const fetchPayrollData = async (userId) => {
    try {
      const payrollRef = collection(db, 'payrolls');
      const payrollSnapshot = await getDocs(payrollRef);
      const payrollDoc = payrollSnapshot.docs.find(doc => doc.data().userID === userId);
  
      if (payrollDoc) {
        const payroll = payrollDoc.data();
        setPayrollData({
          basicSalary: payroll.basicSalary || '',
          transportAllowance: payroll.transportAllowance || '',
          mealAllowance: payroll.mealAllowance || '',
          healthAllowance: payroll.healthAllowance || '',
          housingAllowance: payroll.housingAllowance || '',
          incomeTax: payroll.incomeTax || '',
          socialSecurity: payroll.socialSecurity || '',
          loanDeductions: payroll.loanDeductions || ''
        });
        setEditingPayroll(payrollDoc.id);  // Menyimpan ID payroll untuk diedit
        console.log("Payroll Data Loaded:", payroll);
      } else {
        setPayrollData({
          basicSalary: '',
          transportAllowance: '',
          mealAllowance: '',
          healthAllowance: '',
          housingAllowance: '',
          incomeTax: '',
          socialSecurity: '',
          loanDeductions: ''
        });
        setEditingPayroll(null);
        console.log("No payroll found for this user.");
      }
    } catch (error) {
      console.error('Error fetching payroll:', error);
      toast.error('Failed to load payroll data!');
    }
  };  

  const handleSelectUser = (user) => {
    console.log("Selected User ID:", user.id);
    fetchPayrollData(user.id);  // Memanggil data payroll untuk user yang dipilih
  };  

  const handlePayrollSubmit = async (e) => {
    e.preventDefault();
    // Your payroll submit logic here...
  };

  const handleDeletePayroll = async () => {
    // Your payroll delete logic here...
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">Payrolls Admin</h1>

      <FilterSection
        roles={roles}
        departments={departments}
        selectedRole={selectedRole}
        selectedDepartment={selectedDepartment}
        setSelectedRole={setSelectedRole}
        setSelectedDepartment={setSelectedDepartment}
      />
      
      <UsersList filteredUsers={filteredUsers} handleSelectUser={handleSelectUser} />
      {editingPayroll && (
        <PayrollForm
          payrollData={payrollData}
          setPayrollData={setPayrollData}
          handlePayrollSubmit={handlePayrollSubmit}
          handleDeletePayroll={handleDeletePayroll}
          editingPayroll={editingPayroll}
        />
      )}
    </div>
  );
};

export default PayrollsAdmin;
