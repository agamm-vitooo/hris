import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import ikon mata

const AccountPages = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [editId, setEditId] = useState(null); // ID dokumen yang sedang diedit
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [passwordVisible, setPasswordVisible] = useState(false); // State untuk mengatur apakah password terlihat atau tidak
    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore();

    // Fungsi untuk menangani registrasi atau pembaruan
    const handleSave = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            if (editId) {
                // Jika sedang mengedit
                const accountRef = doc(db, "users", editId);
                await updateDoc(accountRef, { email, password });
                toast.success("Account updated successfully!");
            } else {
                // Jika membuat akun baru
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await addDoc(collection(db, "users"), {
                    email: user.email,
                    uid: user.uid,
                    password, // Simpan password
                });

                toast.success("User registered successfully!");
            }

            setEmail('');
            setPassword('');
            setEditId(null);
            fetchAccounts(); // Perbarui daftar akun
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk mengambil daftar akun dari Firestore
    const fetchAccounts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const fetchedAccounts = querySnapshot.docs.map((doc) => ({
                id: doc.id, // Simpan ID dokumen
                ...doc.data(),
            }));
            setAccounts(fetchedAccounts);
        } catch (error) {
            toast.error("Failed to fetch accounts.");
        }
    };

    // Fungsi untuk mengisi data form saat ingin mengedit
    const handleEdit = (account) => {
        setEmail(account.email);
        setPassword(account.password);
        setEditId(account.id); // Simpan ID dokumen yang akan diedit
    };

    // Fungsi untuk menghapus akun
    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "users", id));
            toast.success("Account deleted successfully!");
            fetchAccounts(); // Perbarui daftar akun
        } catch (error) {
            toast.error("Failed to delete account.");
        }
    };

    // Fungsi untuk toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Ambil daftar akun saat komponen dimuat
    useEffect(() => {
        fetchAccounts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
            {/* Form Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
                    {editId ? "Edit Account" : "Register"}
                </h1>
                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full bg-white p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <input
                            type={passwordVisible ? "text" : "password"}  // Gunakan type text jika passwordVisible true
                            placeholder="Password"
                            className="w-full bg-white p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            onClick={togglePasswordVisibility}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        >
                            {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </span>
                    </div>
                    <button
                        type="submit"
                        className={`w-full p-4 rounded-lg font-semibold text-white transition duration-200 ${loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"}`}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : editId ? "Update Account" : "Create Account"}
                    </button>
                </form>
            </div>

            {/* Accounts List Section */}
            <div className="bg-white shadow-lg rounded-lg p-8 mt-10 max-w-md w-full">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Registered Accounts</h2>
                {accounts.length > 0 ? (
                    <ul className="space-y-4 text-gray-700">
                        {accounts.map((account) => (
                            <li
                                key={account.id}
                                className="flex justify-between items-center p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100"
                            >
                                <div className="flex flex-col text-sm">
                                    <span className="font-medium text-gray-700">Email:</span> {account.email}
                                    <span className="font-medium text-gray-700 mt-1">Password:</span> {account.password}
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                                        onClick={() => handleEdit(account)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                        onClick={() => handleDelete(account.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No accounts registered yet.</p>
                )}
            </div>
        </div>
    );
};

export default AccountPages;
