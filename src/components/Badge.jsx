import React from 'react';

export default function Badge({ status, children }) {
  const styles = {
    success: 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/30',
    pending: 'bg-amber-950/40 text-amber-400 border border-amber-800/30',
    failed: 'bg-rose-950/40 text-rose-400 border border-rose-800/30'
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.pending}`}>
      {children}
    </span>
  );
}
