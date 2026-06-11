import React from 'react';
import Badge from './ui/Badge';

export default function TableRow({ id, customer, service, amount, status, time }) {
  return (
    <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
      <td className="py-3 px-4">
        <span className="text-sm font-medium text-zinc-200">{id}</span>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm text-zinc-300">{customer}</span>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm text-zinc-400">{service}</span>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm font-semibold text-zinc-200">{amount}</span>
      </td>
      <td className="py-3 px-4">
        <Badge status={status}>
          {status === 'success' ? 'Sukses' : status === 'pending' ? 'Pending' : 'Gagal'}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm text-zinc-500">{time}</span>
      </td>
    </tr>
  );
}
