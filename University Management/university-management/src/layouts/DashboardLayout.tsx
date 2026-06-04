import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { useLayoutStore } from '../shared/utils/layoutStore';
import { cn } from '../shared/utils/cn';

export const DashboardLayout: React.FC = () => {
  const { isSidebarOpen } = useLayoutStore();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isSidebarOpen ? "ml-64" : "ml-20"
      )}>
        <Navbar />
        
        <div className="flex-1 mt-16 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Outlet />
          </div>
        </div>
        
        <footer className="px-6 py-4 text-center text-slate-400 text-xs border-t border-slate-200">
          © 2026 South East University Admin Dashboard. All rights reserved.
        </footer>
      </main>
    </div>
  );
};
