import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../modules/auth/pages/LoginPage';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { UserManagementPage } from '../modules/administration/pages/UserManagementPage';
import { DepartmentManagement } from '../modules/department/pages/DepartmentManagement';
import { SemesterListPage } from '../modules/semester/pages/SemesterListPage';
import { SemesterCreatePage } from '../modules/semester/pages/SemesterCreatePage';
import { SemesterUpdatePage } from '../modules/semester/pages/SemesterUpdatePage';
import { SemesterDetailsPage } from '../modules/semester/pages/SemesterDetailsPage';
import { StudentListPage } from '../modules/student/pages/StudentListPage';
import { StudentEnrollmentPage } from '../modules/student/pages/StudentEnrollmentPage';
import { StudentUpdatePage } from '../modules/student/pages/StudentUpdatePage';
import { StudentDetailsPage } from '../modules/student/pages/StudentDetailsPage';
import { FacultyListPage } from '../modules/faculty/pages/FacultyListPage';
import { FacultyEnrollmentPage } from '../modules/faculty/pages/FacultyEnrollmentPage';
import { FacultyUpdatePage } from '../modules/faculty/pages/FacultyUpdatePage';
import { FacultyDetailsPage } from '../modules/faculty/pages/FacultyDetailsPage';
import { ProfilePage } from '../modules/profile/pages/ProfilePage';
import { ProfileEditPage } from '../modules/profile/pages/ProfileEditPage';

// Simple Dashboard Overview for demonstration
// ... (rest of simple overview skipped for brevity but kept in original)
const DashboardOverview = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
      <p className="text-slate-500 text-sm">Welcome to the South East University management portal.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200 col-span-1 md:col-span-2 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-indigo-100 max-w-md">You have 5 pending student registrations and 2 faculty requests that need your attention today.</p>
          <button className="mt-6 px-6 py-2.5 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
            Review Now
          </button>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <GraduationCap size={120} />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Current Semester</h3>
          <p className="text-sm text-slate-500 mt-1">Spring 2026</p>
        </div>
        <div className="mt-4 space-y-3">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[65%]"></div>
          </div>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">65% Completed</p>
        </div>
      </div>
    </div>
  </div>
);

import { GraduationCap } from 'lucide-react';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: 'dashboard',
            element: <DashboardOverview />,
          },
          {
            path: 'administration',
            children: [
              {
                path: 'users',
                element: <UserManagementPage />,
              },
              {
                path: 'departments',
                element: <DepartmentManagement />,
              },
              {
                path: 'semesters',
                element: <SemesterListPage />,
              },
              {
                path: 'semesters/create',
                element: <SemesterCreatePage />,
              },
              {
                path: 'semesters/:id',
                element: <SemesterDetailsPage />,
              },
              {
                path: 'semesters/:id/edit',
                element: <SemesterUpdatePage />,
              },
            ],
          },
          {
            path: 'students',
            children: [
              {
                index: true,
                element: <StudentListPage />,
              },
              {
                path: 'enroll',
                element: <StudentEnrollmentPage />,
              },
              {
                path: ':id',
                element: <StudentDetailsPage />,
              },
              {
                path: ':id/edit',
                element: <StudentUpdatePage />,
              },
            ],
          },
          {
            path: 'faculties',
            children: [
              {
                index: true,
                element: <FacultyListPage />,
              },
              {
                path: 'enroll',
                element: <FacultyEnrollmentPage />,
              },
              {
                path: ':id',
                element: <FacultyDetailsPage />,
              },
              {
                path: ':id/edit',
                element: <FacultyUpdatePage />,
              },
            ],
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'profile/edit',
            element: <ProfileEditPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
