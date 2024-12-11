import React, { useEffect, useState } from 'react';
import { db } from '../../server/firebase';
import { collection, doc, updateDoc, getDocs } from 'firebase/firestore';
import FilterSection from './payrolls.filterSelection';
import PayrollsForm from './payrollsForm';

const PayrollAdmin = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    role: '',
    department: '',
  });
  const [selectedUser, setSelectedUser] = useState(null);  // State untuk menyimpan user yang sedang diedit
  const [showModal, setShowModal] = useState(false);  // State untuk mengontrol tampilan modal

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,  // Menambahkan ID untuk keperluan update
      }));
      
      setUsers(usersList);
      setFilteredUsers(usersList);

      const uniqueRoles = [...new Set(usersList.map(user => user.role))];
      const uniqueDepartments = [...new Set(usersList.map(user => user.department))];
      
      setRoles(uniqueRoles);
      setDepartments(uniqueDepartments);
    };

    fetchUsers();
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters, [filterName]: value };
      const filtered = users.filter(user => {
        const matchesRole = updatedFilters.role ? user.role === updatedFilters.role : true;
        const matchesDepartment = updatedFilters.department ? user.department === updatedFilters.department : true;
        return matchesRole && matchesDepartment;
      });
      setFilteredUsers(filtered);
      return updatedFilters;
    });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);  // Set the user to be edited
    setShowModal(true);  // Show the modal
  };

  const handleSave = async (updatedUser) => {
    // Cek apakah ID pengguna ada dan data payroll lengkap
    if (!updatedUser.id) {
      alert('ID pengguna tidak ditemukan!');
      return;
    }
  
    if (!updatedUser.gajiPokok || !updatedUser.tunjangan || !updatedUser.potongan) {
      alert('Data payroll tidak lengkap!');
      return;
    }
  
    try {
      console.log('Updating payroll data for user with ID:', updatedUser.id);
  
      const payrollRef = doc(db, 'payrolls', updatedUser.id); // Cek ID yang digunakan untuk referensi dokumen
      const docSnap = await getDocs(payrollRef);  // Mengecek apakah dokumen ada
  
      // Jika dokumen tidak ditemukan
      if (!docSnap.exists()) {
        console.error('Dokumen tidak ditemukan dengan ID:', updatedUser.id);
        alert('Tidak ada data payroll yang ditemukan untuk pengguna ini!');
        return;
      }
  
      // Jika dokumen ada, lanjutkan update
      await updateDoc(payrollRef, {
        gajiPokok: updatedUser.gajiPokok,
        tunjangan: updatedUser.tunjangan,
        potongan: updatedUser.potongan,
        updatedAt: new Date(),  // Menambahkan tanggal pembaruan
      });
  
      alert('Data payroll berhasil diperbarui!');
    } catch (error) {
      console.error('Error updating payroll data:', error);
      alert('Gagal memperbarui data payroll. Cek koneksi dan coba lagi.');
    }
  
    setShowModal(false);  // Menutup modal setelah data disimpan
  };  

  return (
    <div className="font-sans text-black">
      <h1 className="text-2xl font-bold mb-4">Payroll Admin</h1>
      <FilterSection
        roles={roles}
        departments={departments}
        onFilterChange={handleFilterChange}
      />
      <table className="min-w-full table-auto border-collapse border border-gray-200 mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-left bg-gray-100">Nama</th>
            <th className="px-4 py-2 border-b text-left bg-gray-100">Role</th>
            <th className="px-4 py-2 border-b text-left bg-gray-100">Department</th>
            <th className="px-4 py-2 border-b text-left bg-gray-100">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border-b">{user.name}</td>
              <td className="px-4 py-2 border-b">{user.role}</td>
              <td className="px-4 py-2 border-b">{user.department}</td>
              <td className="px-4 py-2 border-b text-center">
                <button
                  onClick={() => handleEdit(user)}
                  className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal untuk form edit */}
      {showModal && (
        <PayrollsForm
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default PayrollAdmin;
