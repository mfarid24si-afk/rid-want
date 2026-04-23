import React from 'react';

const GuestView = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {data.map((book) => (
        <div key={book.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col">
          {/* Image Container */}
          <div className="relative overflow-hidden">
            <img 
              src={book.gambar} 
              alt={book.judul} 
              className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                book.status === 'Tersedia' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
              }`}>
                {book.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-indigo-600 text-xs font-bold tracking-widest uppercase">
                {book.kategori}
              </span>
              <div className="flex items-center text-yellow-500">
                <span className="text-sm font-bold mr-1">{book.rating_ulasan.skor}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl font-extrabold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
              {book.judul}
            </h3>
            <p className="text-gray-500 text-sm mb-4">Oleh {book.penulis}</p>
            
            {/* Nested Data Info */}
            <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                <p className="font-semibold text-gray-400 uppercase tracking-tighter">Penerbit</p>
                <p>{book.informasi_penerbit.nama_penerbit}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-400 uppercase tracking-tighter">Dimensi</p>
                <p>{book.detail_fisik.dimensi}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GuestView;