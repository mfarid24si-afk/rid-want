import React from 'react';
import SidebarCRM from './SidebarCRM';
import TopbarCRM from './TopbarCRM';

export default function LayoutCRM({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <SidebarCRM />
      <div className="flex-1 pl-64 flex flex-col">
        <TopbarCRM />
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
