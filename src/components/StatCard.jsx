import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ title, value, change, isPositive, icon: Icon }) {
  return (
    <div className="bg-[#252525] border border-zinc-800/80 rounded-2xl p-6 hover:border-zinc-700 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-zinc-100">{value}</h3>
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {change}
            </span>
            <span className="text-sm text-zinc-500">vs bulan lalu</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
          <Icon className="w-6 h-6 text-zinc-300" />
        </div>
      </div>
    </div>
  );
}
