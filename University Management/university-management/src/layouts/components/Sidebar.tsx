import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../shared/utils/cn';
import { useLayoutStore } from '../../shared/utils/layoutStore';
import { useAuth } from '../../modules/auth/context/AuthContext';
import { navigationConfig } from '../config/menuConfig';
import type { MenuItem, MenuChild } from '../config/menuConfig';

const SidebarItem: React.FC<{ item: MenuItem; isSidebarOpen: boolean }> = ({ item, isSidebarOpen }) => {
  return (
    <NavLink
      to={item.href || '#'}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
        isActive 
          ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <item.icon className={cn(
        "shrink-0",
        isSidebarOpen ? "w-5 h-5" : "w-6 h-6"
      )} />
      {isSidebarOpen && <span>{item.name}</span>}
    </NavLink>
  );
};

const SidebarDropdown: React.FC<{ item: MenuItem; isSidebarOpen: boolean; toggleSidebar: () => void }> = ({ item, isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  
  // Check if any child is active
  const isChildActive = item.children?.some(child => location.pathname.startsWith(child.href)) || false;
  
  // Initialize state from sessionStorage or if child is active
  const [isOpen, setIsOpen] = useState(() => {
    const saved = sessionStorage.getItem(`sidebar_dropdown_${item.name}`);
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return isChildActive;
  });

  // Keep sessionStorage in sync
  useEffect(() => {
    sessionStorage.setItem(`sidebar_dropdown_${item.name}`, JSON.stringify(isOpen));
  }, [isOpen, item.name]);

  return (
    <div className="flex flex-col space-y-1">
      <button
        onClick={() => {
          if (!isSidebarOpen) {
            toggleSidebar();
            setIsOpen(true);
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
          isChildActive && !isOpen
            ? "bg-indigo-50/50 text-indigo-600"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        <div className="flex items-center gap-3">
          <item.icon className={cn(
            "shrink-0",
            isSidebarOpen ? "w-5 h-5" : "w-6 h-6",
            isChildActive ? "text-indigo-600" : ""
          )} />
          {isSidebarOpen && <span>{item.name}</span>}
        </div>
        {isSidebarOpen && (
          <ChevronDown
            size={16}
            className={cn(
              "transition-transform duration-200 text-slate-400 group-hover:text-slate-600",
              isOpen ? "rotate-180" : ""
            )}
          />
        )}
      </button>

      {/* Dropdown Children */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out overflow-hidden",
          isOpen && isSidebarOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 flex flex-col space-y-1 pl-10 pr-2">
          {item.children?.map((child: MenuChild) => (
            <NavLink
              key={child.name}
              to={child.href}
              className={({ isActive }) => cn(
                "flex items-center py-2 px-3 rounded-lg text-xs font-medium transition-colors relative",
                isActive 
                  ? "text-indigo-600 bg-indigo-50/50 font-bold" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <div className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-colors",
                location.pathname.startsWith(child.href) ? "bg-indigo-600" : "bg-transparent"
              )} />
              {child.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useLayoutStore();
  const { user } = useAuth();
  
  const filteredNavigation = useMemo(() => {
    if (!user) return [];
    
    return navigationConfig
      .filter(item => !item.roles || item.roles.includes(user.role))
      .map(item => {
        if (item.children) {
          return {
            ...item,
            children: item.children.filter(child => !child.roles || child.roles.includes(user.role))
          };
        }
        return item;
      })
      .filter(item => !item.children || item.children.length > 0);
  }, [user]);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-30 shadow-sm flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-indigo-600 p-2 rounded-lg shrink-0">
            <GraduationCap className="text-white" size={24} />
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-slate-900 truncate">SEU Admin</span>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
        {filteredNavigation.map((item) => (
          item.children ? (
            <SidebarDropdown 
              key={item.name} 
              item={item} 
              isSidebarOpen={isSidebarOpen} 
              toggleSidebar={toggleSidebar} 
            />
          ) : (
            <SidebarItem 
              key={item.name} 
              item={item} 
              isSidebarOpen={isSidebarOpen} 
            />
          )
        ))}
      </nav>

      {/* Collapse Button */}
      <div className="p-4 border-t border-slate-100 shrink-0">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </aside>
  );
};
