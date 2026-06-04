import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFaculty } from '../hooks/useFaculties';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../shared/components/ui/Avatar';
import { ArrowLeft, Mail, Phone, User, Droplets, CalendarDays, BookOpen, Briefcase } from 'lucide-react';

export const FacultyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const facultyId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  
  const { data: faculty, isLoading } = useFaculty(facultyId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900">Faculty not found</h3>
        <p className="text-slate-500 mt-2">The faculty record you are looking for does not exist.</p>
        <Button className="mt-4" onClick={() => navigate('/faculties')}>
          Back to Directory
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatEnum = (value: string) => {
    return value.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/faculties')}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">Faculty Profile</h1>
        </div>
        <Button onClick={() => navigate(`/faculties/${faculty.id}/edit`)}>
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <Avatar className="h-32 w-32 border-4 border-white shadow-xl mb-4">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${faculty.facultyCode}`} />
              <AvatarFallback>{faculty.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-slate-900">{faculty.fullName}</h2>
            <p className="text-indigo-600 font-bold mb-1">{faculty.facultyCode}</p>
            <p className="text-slate-500 text-sm mb-4">{formatEnum(faculty.designation)}</p>
            <Badge variant={faculty.isActive ? 'success' : 'destructive'} className="mb-6">
              {faculty.isActive ? 'ACTIVE FACULTY' : 'INACTIVE'}
            </Badge>

            <div className="w-full space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{faculty.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{faculty.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Employment Info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-3 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Employment Details
            </h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Department</p>
                <p className="font-semibold text-slate-900">{faculty.department?.departmentName || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Employee ID</p>
                <p className="font-semibold text-slate-900">{faculty.employeeId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Employment Type</p>
                <p className="font-semibold text-slate-900">{formatEnum(faculty.employmentType)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Joining Date</p>
                <p className="font-semibold text-slate-900">{formatDate(faculty.joiningDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Office Room</p>
                <p className="font-semibold text-slate-900">{faculty.officeRoom}</p>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-3 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Academic Credentials
            </h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="col-span-2">
                <p className="text-sm font-medium text-slate-500 mb-1">Highest Qualification</p>
                <p className="font-semibold text-slate-900">{faculty.highestQualification}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-slate-500 mb-1">Specialization</p>
                <p className="font-semibold text-slate-900">{faculty.specialization}</p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-3 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Personal Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-1">
                  <User className="w-4 h-4" /> Gender
                </div>
                <p className="font-medium text-slate-900">{formatEnum(faculty.gender)}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-1">
                  <Droplets className="w-4 h-4 text-red-500" /> Blood Group
                </div>
                <p className="font-medium text-slate-900">{faculty.bloodGroup}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-1">
                  <CalendarDays className="w-4 h-4" /> Date of Birth
                </div>
                <p className="font-medium text-slate-900">{formatDate(faculty.dateOfBirth)}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
