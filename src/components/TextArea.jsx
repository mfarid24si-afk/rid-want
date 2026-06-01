import React from 'react';

export default function TextArea({ label, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-medium text-zinc-400">{label}</label>}
      <textarea rows="3" placeholder={placeholder} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-sky-400 w-full" />
    </div>
  );
}
