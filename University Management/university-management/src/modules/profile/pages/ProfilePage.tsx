import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileDetails } from '../hooks/useProfile';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../shared/components/ui/Avatar';
import { 
  User, Phone, MapPin, CalendarDays, Droplets, 
  BookOpen, Briefcase, GraduationCap, Clock, Award, ShieldAlert,
  Building, UserCheck, Shield
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading, error } = useProfileDetails();

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Loading skeleton */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 animate-pulse">
          <div className="h-32 w-32 rounded-full bg-slate-200"></div>
          <div className="space-y-3 flex-1">
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/6"></div>
            <div className="h-4 bg-slate-200 rounded w-1/12"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl h-64 border border-slate-100 shadow-sm animate-pulse"></div>
          <div className="bg-white p-6 rounded-3xl h-64 border border-slate-100 shadow-sm animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-16 max-w-md mx-auto space-y-4">
        <div className="inline-flex p-4 bg-red-50 text-red-600 rounded-full">
          <ShieldAlert size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Failed to load profile</h3>
        <p className="text-slate-500">There was an issue fetching your account information. Please try logging in again.</p>
        <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatEnum = (value?: string) => {
    if (!value) return '-';
    return value
      .replace(/_/g, ' ')
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account information and preferences.</p>
        </div>
        <Button onClick={() => navigate('/profile/edit')} className="bg-indigo-600 hover:bg-indigo-700">
          Edit Profile
        </Button>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 text-center md:text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 select-none pointer-events-none">
          <User size={180} className="text-indigo-900" />
        </div>
        <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} />
          <AvatarFallback>{profile.fullName?.charAt(0).toUpperCase() || profile.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-2 relative z-10">
          <h2 className="text-2xl font-bold text-slate-900">{profile.fullName || 'Administrator'}</h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <span className="text-indigo-600 font-bold tracking-wide">{profile.username}</span>
            <span className="text-slate-300">•</span>
            <Badge variant="info" className="font-bold tracking-wider">{profile.role}</Badge>
            <span className="text-slate-300">•</span>
            <Badge variant={profile.isActive ? 'success' : 'destructive'}>
              {profile.isActive ? 'Active Account' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-sm text-slate-500">Registered email: {profile.email || 'N/A'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section 1: Account Information */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Account Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 font-medium">Username</p>
              <p className="font-semibold text-slate-900 mt-0.5">{profile.username}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Email Address</p>
              <p className="font-semibold text-slate-900 mt-0.5">{profile.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Role Privilege</p>
              <p className="font-semibold text-slate-900 mt-0.5">{formatEnum(profile.role)}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Status</p>
              <p className="font-semibold text-emerald-600 flex items-center gap-1.5 mt-0.5">
                <UserCheck size={16} /> Active
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Personal Information */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Personal Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 font-medium">Gender</p>
              <p className="font-semibold text-slate-900 mt-0.5">{formatEnum(profile.gender)}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Blood Group</p>
              <p className="font-semibold text-red-600 flex items-center gap-1 mt-0.5">
                <Droplets size={16} /> {profile.bloodGroup || '-'}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Date of Birth</p>
              <p className="font-semibold text-slate-900 mt-0.5">{formatDate(profile.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Contact Phone</p>
              <p className="font-semibold text-slate-900 mt-0.5">{profile.phone || '-'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-500 font-medium">Residential Address</p>
              <p className="font-semibold text-slate-900 mt-0.5 flex items-start gap-1.5">
                <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <span>{profile.address || '-'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Role-Specific Details */}
        {profile.role === 'STUDENT' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Academic Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-sm">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-slate-500 font-medium flex items-center gap-1.5"><GraduationCap size={16} /> Student ID</p>
                <p className="font-bold text-slate-900 mt-1 text-lg">{profile.studentId}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-slate-500 font-medium flex items-center gap-1.5"><Building size={16} /> Department</p>
                <p className="font-bold text-indigo-600 mt-1 text-lg">{profile.department}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-slate-500 font-medium flex items-center gap-1.5"><Clock size={16} /> Semester</p>
                <p className="font-bold text-slate-900 mt-1 text-lg">{profile.semester}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-slate-500 font-medium flex items-center gap-1.5"><CalendarDays size={16} /> Admission Date</p>
                <p className="font-semibold text-slate-900 mt-1">{formatDate(profile.admissionDate)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 sm:col-span-2">
                <p className="text-slate-500 font-medium">Guardian / Emergency Contact Name</p>
                <p className="font-bold text-slate-900 mt-1">{profile.guardianName || '-'}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 sm:col-span-2">
                <p className="text-slate-500 font-medium flex items-center gap-1.5"><Phone size={16} /> Emergency Contact Phone</p>
                <p className="font-bold text-slate-900 mt-1">{profile.guardianPhone || '-'}</p>
              </div>
            </div>
          </div>
        )}

        {profile.role === 'FACULTY' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Faculty & Employment Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-sm">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-slate-500 font-medium">Faculty Code</p>
                <p className="font-bold text-slate-900 mt-1 text-lg">{profile.facultyCode}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-slate-500 font-medium">Employee ID</p>
                <p className="font-bold text-slate-900 mt-1 text-lg">{profile.employeeId}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-slate-500 font-medium">Department</p>
                <p className="font-bold text-indigo-600 mt-1 text-lg">{profile.department}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-slate-500 font-medium">Designation</p>
                <p className="font-bold text-slate-900 mt-1">{formatEnum(profile.designation)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-slate-500 font-medium">Joining Date</p>
                <p className="font-semibold text-slate-900 mt-1">{formatDate(profile.joiningDate)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-slate-500 font-medium">Employment Type</p>
                <p className="font-semibold text-slate-900 mt-1">{formatEnum(profile.employmentType)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-slate-500 font-medium flex items-center gap-1.5"><Award size={16} /> Office Room</p>
                <p className="font-bold text-slate-900 mt-1">{profile.officeRoom || '-'}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-slate-500 font-medium">Highest Qualification</p>
                <p className="font-semibold text-slate-900 mt-1">{profile.qualification || '-'}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 sm:col-span-4">
                <p className="text-slate-500 font-medium">Area of Specialization</p>
                <p className="font-semibold text-indigo-950 mt-1">{profile.specialization || '-'}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
