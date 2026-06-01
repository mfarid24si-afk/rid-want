import React from 'react';

export default function TopbarCRM({ userName = "Admin User" }) {
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="w-96">
        <input 
          type="text" 
          placeholder="Cari data pelanggan, leads, atau deals..." 
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-slate-700 bg-slate-50 rounded-full relative">
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          🔔
        </button>
        <div className="flex items-center gap-3 border-l pl-4">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
            {userName.charAt(0)}
          </div>
          <span className="text-sm font-semibold text-slate-700">{userName}</span>
        </div>
      </div>
    </header>
  );
}
