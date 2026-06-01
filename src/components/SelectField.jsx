import React from 'react';

export default function SelectField({ label, options = [] }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-medium text-zinc-400">{label}</label>}
      <select className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-sky-400 w-full">
        {options.map((opt, i) => <option key={i} value={opt.value} className="bg-zinc-900">{opt.label}</option>)}
      </select>
    </div>
  );
}
