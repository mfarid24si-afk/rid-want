import React, { useState } from 'react';
import dataBuku from './data_buku.json';

const EldenLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const filteredData = dataBuku.filter(item => 
    item.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#c4c4c4] p-6 font-serif selection:bg-[#c5a059] selection:text-black">
      {/* Background Overlay: Tekstur Batu Tua */}
      <div className="fixed inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HEADER: Site of Grace Style */}
        <header className="flex flex-col items-center mb-16 text-center">
          <div className="w-1 h-20 bg-gradient-to-b from-transparent via-[#c5a059] to-transparent mb-4"></div>
          <h1 className="text-5xl md:text-7xl font-cinzel font-normal tracking-[0.2em] text-[#e5e5e5] drop-shadow-2xl">
            PERPUSTAKAAN <span className="text-[#c5a059]">DIGITAL</span>
          </h1>
          <p className="font-cormorant italic text-xl text-[#888] mt-2 tracking-widest uppercase">TEMUKAN BUKU YANG AKAN ANDA BACA</p>
          
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className="mt-8 px-10 py-2 border border-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all duration-700 font-cinzel text-xs tracking-[0.3em]"
          >
            {isAdmin ? 'KEMBALI MENJADI GUEST' : 'BANGKIT MENJADI ADMIN'}
          </button>
        </header>

        {/* SEARCH: Minimalist Gothic */}
        <div className="relative max-w-2xl mx-auto mb-20 group">
          <input 
            type="text" 
            placeholder="Silahkan cari bukunya..." 
            className="w-full bg-transparent border-b border-[#3c3c3c] py-4 px-2 outline-none text-center font-cormorant italic text-2xl focus:border-[#c5a059] transition-colors"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c5a059] group-focus-within:w-full transition-all duration-1000"></div>
        </div>

        {!isAdmin ? (
          /* GUEST VIEW: Item Inventory Style */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredData.map((book) => (
              <div key={book.id} className="group relative">
                {/* Book Frame */}
                <div className="elden-border bg-[#151515] p-1 transition-transform duration-500 group-hover:-translate-y-2 group-hover:grace-glow">
                  <div className="relative aspect-[3/4] overflow-hidden grayscale contrast-125 opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700">
                    <img src={book.gambar} alt={book.judul} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60"></div>
                  </div>

                  <div className="p-6 text-center border-t border-[#3c3c3c]">
                    <span className="text-[10px] font-cinzel text-[#c5a059] tracking-widest uppercase mb-2 block">
                      {book.kategori} — {book.status}
                    </span>
                    <h3 className="text-2xl font-cinzel text-[#e5e5e5] mb-2">{book.judul}</h3>
                    <p className="font-cormorant italic text-[#888]">{book.penulis}</p>
                    
                    {/* Stats bergaya Menu Equipment */}
                    <div className="mt-6 flex justify-center gap-6 text-[11px] font-cinzel border-t border-[#2a2a2a] pt-4">
                      <div className="flex flex-col">
                        <span className="text-[#666]">RATING</span>
                        <span className="text-[#c5a059]">{book.rating_ulasan.skor}</span>
                      </div>
                      <div className="flex flex-col border-l border-[#2a2a2a] pl-6">
                        <span className="text-[#666]">PAGES</span>
                        <span>{book.detail_fisik.jumlah_halaman}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative shadow below */}
                <div className="w-full h-1 bg-black blur-md mt-2 opacity-50 group-hover:bg-[#c5a059]/20 transition-all"></div>
              </div>
            ))}
          </div>
        ) : (
          /* ADMIN VIEW: Ancient Scroll / Ledger Style */
          <div className="bg-[#111] elden-border overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1a1a1a] font-cinzel text-[10px] tracking-[0.2em] text-[#c5a059]">
                <tr className="border-b border-[#3c3c3c]">
                  <th className="p-6">ID BUKU</th>
                  <th className="p-6">JUDUL BUKU</th>
                  <th className="p-6">JUMLAH HALAMAN</th>
                  <th className="p-6">STATUS</th>
                  <th className="p-6 text-center">RITES</th>
                </tr>
              </thead>
              <tbody className="font-cormorant text-lg text-[#aaa]">
                {filteredData.map((book) => (
                  <tr key={book.id} className="border-b border-[#222] hover:bg-[#1a1a1a] transition-colors">
                    <td className="p-6 font-mono text-xs text-[#555]">{book.id}</td>
                    <td className="p-6">
                      <div className="font-cinzel text-sm text-[#e5e5e5]">{book.judul.toUpperCase()}</div>
                      <div className="italic text-xs opacity-50">Chronicled by {book.penulis}</div>
                    </td>
                    <td className="p-6 text-sm">
                      {book.detail_fisik.jumlah_halaman} Pages <br/>
                      <span className="opacity-40 italic">{book.detail_fisik.dimensi}</span>
                    </td>
                    <td className="p-6">
                      <span className={`text-[10px] font-cinzel tracking-widest ${
                        book.status === 'Tersedia' ? 'text-green-800' : 'text-red-900'
                      }`}>
                        [{book.status.toUpperCase()}]
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <button className="text-[#c5a059] font-cinzel text-[10px] hover:text-white tracking-widest underline decoration-[#c5a059]/30">ALTER</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FOOTER */}
        <footer className="mt-32 mb-16 text-center opacity-30">
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent mx-auto mb-6"></div>
          <p className="font-cinzel text-[10px] tracking-[0.5em]">BY M.FARID FADILLAH</p>
        </footer>
      </div>
    </div>
  );
};

export default EldenLibrary;