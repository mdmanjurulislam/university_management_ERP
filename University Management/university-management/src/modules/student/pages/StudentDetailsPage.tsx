import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudent } from '../hooks/useStudents';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../shared/components/ui/Avatar';
import { ArrowLeft, Mail, Phone, MapPin, User, Droplets, CalendarDays, BookOpen, GraduationCap } from 'lucide-react';

export const StudentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const studentId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  
  const { data: student, isLoading } = useStudent(studentId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900">Student not found</h3>
        <p className="text-slate-500 mt-2">The student record you are looking for does not exist.</p>
        <Button className="mt-4" onClick={() => navigate('/students')}>
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/students')}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">Student Profile</h1>
        </div>
        <Button onClick={() => navigate(`/students/${student.id}/edit`)}>
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <Avatar className="h-32 w-32 border-4 border-white shadow-xl mb-4">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.studentId}`} />
              <AvatarFallback>{student.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-slate-900">{student.fullName}</h2>
            <p className="text-indigo-600 font-bold mb-4">{student.studentId}</p>
            <Badge variant={student.isActive ? 'success' : 'destructive'} className="mb-6">
              {student.isActive ? 'ACTIVE STUDENT' : 'INACTIVE'}
            </Badge>

            <div className="w-full space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{student.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-left">{student.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Academic Info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-3 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Academic Information
            </h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Department</p>
                <p className="font-semibold text-slate-900">{student.department?.departmentName || '-'}</p>
                <p className="text-xs text-slate-500 mt-0.5">Code: {student.department?.departmentCode}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Current Semester</p>
                <p className="font-semibold text-slate-900">{student.semester?.semesterName} {student.semester?.year}</p>
                <p className="text-xs text-slate-500 mt-0.5">Code: {student.semester?.semesterCode}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Batch Year</p>
                <p className="font-semibold text-slate-900">{student.batchYear}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Admission Date</p>
                <p className="font-semibold text-slate-900">{student.admissionDate ? formatDate(student.admissionDate) : '-'}</p>
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
                <p className="font-medium text-slate-900">{student.gender}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-1">
                  <Droplets className="w-4 h-4 text-red-500" /> Blood Group
                </div>
                <p className="font-medium text-slate-900">{student.bloodGroup}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-1">
                  <CalendarDays className="w-4 h-4" /> Date of Birth
                </div>
                <p className="font-medium text-slate-900">{formatDate(student.dateOfBirth)}</p>
              </div>
            </div>
          </div>

          {/* Guardian Info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-3 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              Guardian Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Guardian Name</p>
                <p className="font-medium text-slate-900">{student.guardianName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Guardian Contact</p>
                <p className="font-medium text-slate-900">{student.guardianPhone}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
