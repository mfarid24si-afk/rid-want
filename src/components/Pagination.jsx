import React from 'react';

export default function Pagination() {
  return (
    <div className="flex items-center justify-between bg-[#252525] px-6 py-4 rounded-2xl border border-zinc-800/80 mt-4 text-zinc-400 text-xs">
      <p>Showing <span className="text-zinc-200 font-medium">1</span> to <span className="text-zinc-200 font-medium">4</span></p>
      <div className="flex gap-2">
        <button className="px-3 py-1.5 font-medium rounded-lg bg-zinc-800 text-sky-400 border border-zinc-700">1</button>
        <button className="px-3 py-1.5 font-medium rounded-lg text-zinc-500 hover:bg-zinc-800">2</button>
      </div>
    </div>
  );
}
