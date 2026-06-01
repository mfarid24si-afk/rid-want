import React from 'react';
import { Clock } from 'lucide-react';

export default function AppointmentItem({ time, customer, service, therapist }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
      <div className="flex items-center gap-2 text-sky-400 min-w-[60px]">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-semibold">{time}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-200 truncate">{customer}</p>
        <p className="text-xs text-zinc-400 truncate">{service}</p>
        <p className="text-xs text-sky-400/80 mt-1">{therapist}</p>
      </div>
    </div>
  );
}
