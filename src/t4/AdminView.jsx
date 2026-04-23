import React from 'react';

const AdminView = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">ID & Judul</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Spesifikasi (Nested)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((book) => (
              <tr key={book.id} className="hover:bg-indigo-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img src={book.gambar} className="w-10 h-10 rounded-lg object-cover mr-3" />
                    <div>
                      <div className="font-bold text-gray-900">{book.judul}</div>
                      <div className="text-xs text-gray-400">{book.id} | {book.penulis}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {book.kategori}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <div className="text-xs">
                    <strong>Penerbit:</strong> {book.informasi_penerbit.nama_penerbit} ({book.informasi_penerbit.tahun_terbit})<br/>
                    <strong>Fisik:</strong> {book.detail_fisik.jumlah_halaman} Hal / {book.detail_fisik.berat_gram}g
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center w-fit px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    book.status === 'Tersedia' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      book.status === 'Tersedia' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    {book.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">Edit</button>
                    <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminView;