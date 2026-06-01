import React from 'react';

export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-[#252525] border border-zinc-800/80 rounded-2xl p-6 hover:border-zinc-700 transition-all ${className}`}>
      {children}
    </div>
  );
}
