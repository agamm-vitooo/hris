import React, { useState, useEffect } from 'react';
import { db } from '../../server/firebase'; // Mengimpor Firestore instance
import { collection, getDocs, query, where } from 'firebase/firestore'; // Mengimpor fungsi Firestore untuk query data
import { toast } from 'react-toastify'; // Untuk notifikasi error
import FilterSection from './payrolls.filterSelection'; // Komponen filter
import UsersList from './payroll.userList'; // Komponen untuk menampilkan daftar pengguna
import PayrollForm from './payrollsForm'; // Form untuk mengedit payroll

const PayrollsAdmin = () => {
  const [users, setUsers] = useState([]); // Daftar pengguna
  const [filteredUsers, setFilteredUsers] = useState([]); // Pengguna setelah difilter
  const [selectedRole, setSelectedRole] = useState(''); // Role yang dipilih
  const [selectedDepartment, setSelectedDepartment] = useState(''); // Departemen yang dipilih
  const [roles, setRoles] = useState([]); // Daftar roles yang ada
  const [departments, setDepartments] = useState([]); // Daftar departemen yang ada
  const [editingPayroll, setEditingPayroll] = useState(null); // Data payroll yang sedang diedit
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

  // Effect untuk mengambil daftar pengguna
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

  // Effect untuk menyaring pengguna berdasarkan role dan department
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

  // Mengambil data payroll untuk pengguna yang dipilih
  const fetchPayrollData = async (userId) => {
    try {
      const payrollRef = collection(db, 'payrolls');
      const q = query(payrollRef, where('uid', '==', userId));
      const querySnapshot = await getDocs(q);
  
      console.log("Payroll Query Snapshot:", querySnapshot.empty);  // Debugging log
  
      if (!querySnapshot.empty) {
        const payrollDoc = querySnapshot.docs[0];
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
      } else {
        console.log("No payroll data found for this user");  // Debugging log
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
      }
    } catch (error) {
      console.error('Error fetching payroll:', error);
      toast.error('Failed to load payroll data!');
    }
  };  

  // Menangani saat pengguna dipilih untuk diedit
  const handleSelectUser = (user) => {
    console.log("Selected User ID:", user.id);  // Debugging log
    fetchPayrollData(user.id);  // Memanggil data payroll untuk user yang dipilih
  };
  
  // Menangani submit form payroll
  const handlePayrollSubmit = async (e) => {
    e.preventDefault();
    // Logika pengiriman payroll (tambah/ubah payroll)
    toast.success('Payroll data saved successfully!');
  };

  // Menangani penghapusan payroll
  const handleDeletePayroll = async () => {
    // Logika penghapusan payroll
    toast.success('Payroll data deleted successfully!');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">Payrolls Admin</h1>

      {/* Filter Section */}
      <FilterSection
        roles={roles}
        departments={departments}
        selectedRole={selectedRole}
        selectedDepartment={selectedDepartment}
        setSelectedRole={setSelectedRole}
        setSelectedDepartment={setSelectedDepartment}
      />

      {/* Daftar Pengguna */}
      <UsersList
        filteredUsers={filteredUsers}
        handleSelectUser={handleSelectUser}
      />

      {/* Form Payroll */}
      {editingPayroll && (
        <PayrollForm
          payrollData={payrollData}
          setPayrollData={setPayrollData}
          handlePayrollSubmit={handlePayrollSubmit}
          handleDeletePayroll={handleDeletePayroll}
        />
      )}
    </div>
  );
};

export default PayrollsAdmin;
