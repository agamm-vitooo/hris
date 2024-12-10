import React, { useState, useEffect } from 'react';
import { db } from '../../server/firebase'; // Import instance Firestore
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';

const PayrollsAdmin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [payrolls, setPayrolls] = useState([]); // state untuk menyimpan semua payrolls
  const [userPayrolls, setUserPayrolls] = useState([]); // state untuk payrolls berdasarkan user yang dipilih
  const [basicSalary, setBasicSalary] = useState('');
  const [transportAllowance, setTransportAllowance] = useState('');
  const [mealAllowance, setMealAllowance] = useState('');
  const [healthAllowance, setHealthAllowance] = useState('');
  const [housingAllowance, setHousingAllowance] = useState('');
  const [incomeTax, setIncomeTax] = useState('');
  const [socialSecurity, setSocialSecurity] = useState('');
  const [loanDeductions, setLoanDeductions] = useState('');

  useEffect(() => {
    // Fetching users from Firestore
    const fetchUsers = async () => {
      try {
        const userRef = collection(db, 'users');
        const querySnapshot = await getDocs(userRef);
        const usersList = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersList); // Save users data to state
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users data!');
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Fetch all payrolls for listing when no user is selected
    // Fetch all payrolls and associate each with the user's name
const fetchAllPayrolls = async () => {
  try {
    const payrollRef = collection(db, 'payrolls');
    const querySnapshot = await getDocs(payrollRef);
    const payrollList = [];
    
    for (const doc of querySnapshot.docs) {
      const payroll = doc.data();
      // Ambil data user berdasarkan userID
      const userRef = doc(db, 'users', payroll.userID);
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data();
      
      // Gabungkan data payroll dan user
      payrollList.push({
        id: doc.id,
        ...payroll,
        userName: userData.name,  // Ambil nama pengguna
        userEmail: userData.email  // Ambil email pengguna
      });
    }
    
    setPayrolls(payrollList); // Save payrolls data with user info
  } catch (error) {
    console.error('Error fetching payrolls:', error);
    toast.error('Failed to load payrolls data!');
  }
};
    fetchAllPayrolls();
  }, []);

  useEffect(() => {
    const fetchUserPayrolls = async () => {
      if (selectedUser) {
        try {
          const payrollRef = collection(db, 'payrolls');
          const q = query(payrollRef, where("userID", "==", selectedUser.id));
          const querySnapshot = await getDocs(q);
          const payrollList = [];
          querySnapshot.forEach((doc) => {
            payrollList.push({ id: doc.id, ...doc.data() });
          });
          setUserPayrolls(payrollList);
        } catch (error) {
          console.error('Error fetching user payrolls:', error);
          toast.error('Failed to load payrolls for selected user!');
        }
      }
    };
    fetchUserPayrolls();
  }, [selectedUser]); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      toast.error('Please select a user!');
      return;
    }

    const totalAllowance = parseFloat(transportAllowance) + parseFloat(mealAllowance) + parseFloat(healthAllowance) + parseFloat(housingAllowance);
    const totalDeductions = parseFloat(incomeTax) + parseFloat(socialSecurity) + parseFloat(loanDeductions);

    const payrollData = {
      userID: selectedUser.id,
      basicSalary: parseFloat(basicSalary),
      transportAllowance: parseFloat(transportAllowance),
      mealAllowance: parseFloat(mealAllowance),
      healthAllowance: parseFloat(healthAllowance),
      housingAllowance: parseFloat(housingAllowance),
      incomeTax: parseFloat(incomeTax),
      socialSecurity: parseFloat(socialSecurity),
      loanDeductions: parseFloat(loanDeductions),
      totalAllowance,
      totalDeductions,
      totalSalary: parseFloat(basicSalary) + totalAllowance - totalDeductions,
      createdAt: new Date(),
    };

    try {
      const payrollRef = collection(db, 'payrolls');
      await addDoc(payrollRef, payrollData);
      toast.success('Payroll data saved successfully!');

      setBasicSalary('');
      setTransportAllowance('');
      setMealAllowance('');
      setHealthAllowance('');
      setHousingAllowance('');
      setIncomeTax('');
      setSocialSecurity('');
      setLoanDeductions('');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error saving payroll:', error);
      toast.error('Failed to save payroll data!');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">Payrolls Admin</h1>

      <div className="mb-4">
        <label className="block text-lg mb-2 text-primary">Select User</label>
        <select
          className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-primary"
          value={selectedUser ? selectedUser.id : ''}
          onChange={(e) => {
            const user = users.find(user => user.id === e.target.value);
            setSelectedUser(user);
          }}
        >
          <option value="">Select a user...</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

{!selectedUser && payrolls.length > 0 && (
  <div className="mb-4">
    <h3 className="text-xl font-semibold text-primary mb-2">All Payrolls</h3>
    <ul className="space-y-2">
      {payrolls.map((payroll) => (
        <li key={payroll.id} className="bg-gray-100 p-4 rounded-lg border border-gray-300 text-primary">
          <div><strong>Nama User:</strong> {payroll.userName}</div> {/* Nama Pengguna */}
          <div><strong>Email User:</strong> {payroll.userEmail}</div> {/* Email Pengguna */}
          <div><strong>Basic Salary:</strong> {payroll.basicSalary}</div>
          <div><strong>Total Allowances:</strong> {payroll.totalAllowance}</div>
          <div><strong>Total Deductions:</strong> {payroll.totalDeductions}</div>
          <div><strong>Total Salary:</strong> {payroll.totalSalary}</div>
          <div><strong>Created At:</strong> {new Date(payroll.createdAt.seconds * 1000).toLocaleDateString()}</div>
        </li>
      ))}
    </ul>
  </div>
)}

{selectedUser && userPayrolls.length > 0 && (
  <div className="mb-4">
    <h3 className="text-xl font-semibold text-primary mb-2">Payrolls for {selectedUser.name}</h3>
    <ul className="space-y-2">
      {userPayrolls.map((payroll) => (
        <li key={payroll.id} className="bg-gray-100 p-4 rounded-lg border border-gray-300 text-primary">
          <div><strong>Nama User:</strong> {selectedUser.name}</div> {/* Nama Pengguna */}
          <div><strong>Basic Salary:</strong> {payroll.basicSalary}</div>
          <div><strong>Total Allowances:</strong> {payroll.totalAllowance}</div>
          <div><strong>Total Deductions:</strong> {payroll.totalDeductions}</div>
          <div><strong>Total Salary:</strong> {payroll.totalSalary}</div>
          <div><strong>Created At:</strong> {new Date(payroll.createdAt.seconds * 1000).toLocaleDateString()}</div>
        </li>
      ))}
    </ul>
  </div>
)}

      {selectedUser && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg mb-2 text-primary">Basic Salary</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded text-primary bg-gray-100"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              required
            />
          </div>

          {/* Tunjangan */}
          <h3 className="text-lg font-semibold mb-2 text-primary">Tunjangan</h3>
          <div>
            <label className="block text-lg mb-2 text-primary">Tunjangan Transportasi</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded text-primary bg-gray-100"
              value={transportAllowance}
              onChange={(e) => setTransportAllowance(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-lg mb-2 text-primary">Tunjangan Makan</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded text-primary bg-gray-100"
              value={mealAllowance}
              onChange={(e) => setMealAllowance(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-lg mb-2 text-primary">Tunjangan Kesehatan</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded text-primary bg-gray-100"
              value={healthAllowance}
              onChange={(e) => setHealthAllowance(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-lg mb-2 text-primary">Tunjangan Perumahan</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded text-primary bg-gray-100"
              value={housingAllowance}
              onChange={(e) => setHousingAllowance(e.target.value)}
            />
          </div>

          {/* Potongan */}
          <h3 className="text-lg font-semibold mb-2 text-primary">Potongan</h3>
          <div>
            <label className="block text-lg mb-2 text-primary">Pajak Penghasilan</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded text-primary bg-gray-100"
              value={incomeTax}
              onChange={(e) => setIncomeTax(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-lg mb-2 text-primary">Potongan Jaminan Sosial</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded text-primary bg-gray-100"
              value={socialSecurity}
              onChange={(e) => setSocialSecurity(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-lg mb-2 text-primary">Potongan Kredit atau Pinjaman</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded text-primary bg-gray-100"
              value={loanDeductions}
              onChange={(e) => setLoanDeductions(e.target.value)}
            />
          </div>

          {/* Total Salary */}
          <div className="mt-4 font-bold text-xl">
            <p>Total Gaji Akhir: {parseFloat(basicSalary) + (parseFloat(transportAllowance) + parseFloat(mealAllowance) + parseFloat(healthAllowance) + parseFloat(housingAllowance)) - (parseFloat(incomeTax) + parseFloat(socialSecurity) + parseFloat(loanDeductions))}</p>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Save Payroll
          </button>
        </form>
      )}
    </div>
  );
};

export default PayrollsAdmin;
