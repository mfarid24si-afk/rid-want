import React from 'react';

export default function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800">
            {headers.map((head, i) => (
              <th key={i} className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
}
