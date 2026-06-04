import { 
  LayoutDashboard, Users, Settings, GraduationCap, 
  UserCircle, Building2
} from 'lucide-react';
import React from 'react';

export interface MenuChild {
  name: string;
  href: string;
  roles?: string[];
}

export interface MenuItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  children?: MenuChild[];
  roles?: string[];
}

export const navigationConfig: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { 
    name: 'Administration', 
    icon: Building2,
    children: [
      { name: 'User Management', href: '/administration/users' },
      { name: 'Department Management', href: '/administration/departments', roles: ['ADMIN'] },
      { name: 'Semester Management', href: '/administration/semesters', roles: ['ADMIN'] }
    ]
  },
  {
    name: 'Student Module',
    icon: Users,
    children: [
      { name: 'Student Management', href: '/students' }
    ]
  },
  {
    name: 'Faculty Module',
    icon: GraduationCap,
    children: [
      { name: 'Faculty Management', href: '/faculties' }
    ]
  },
  { name: 'Academic Records', href: '/academics', icon: GraduationCap },
  { name: 'Profile', href: '/profile', icon: UserCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
];
