import React, { useState, useEffect } from 'react';

const PayrollsForm = ({ user, onClose, onSave }) => {
  const [gajiPokok, setGajiPokok] = useState('');
  const [tunjangan, setTunjangan] = useState('');
  const [potongan, setPotongan] = useState('');

  // Mengatur form saat modal dibuka untuk pengguna yang dipilih
  useEffect(() => {
    if (user) {
      setGajiPokok(user.gajiPokok || '');
      setTunjangan(user.tunjangan || '');
      setPotongan(user.potongan || '');
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      gajiPokok,
      tunjangan,
      potongan,
    };
    onSave(updatedUser);  // Kirimkan data ke parent untuk menyimpan perubahan
    onClose();  // Tutup modal setelah disimpan
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:max-w-md lg:max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Edit Payroll Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="gajiPokok" className="block text-sm font-medium text-gray-700">Gaji Pokok</label>
            <input
              type="number"
              id="gajiPokok"
              value={gajiPokok}
              onChange={(e) => setGajiPokok(e.target.value)}
              className="mt-1 bg-gray-100 text-primary block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tunjangan" className="block text-sm font-medium text-gray-700">Tunjangan</label>
            <input
              type="number"
              id="tunjangan"
              value={tunjangan}
              onChange={(e) => setTunjangan(e.target.value)}
              className="mt-1 block bg-gray-100 text-primary w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="potongan" className="block text-sm font-medium text-gray-700">Potongan</label>
            <input
              type="number"
              id="potongan"
              value={potongan}
              onChange={(e) => setPotongan(e.target.value)}
              className="mt-1 block bg-gray-100 text-primary w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 bg-gray-400 text-white px-4 py-2 rounded-md">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PayrollsForm;
