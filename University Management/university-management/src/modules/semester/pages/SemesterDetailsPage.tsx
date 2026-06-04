import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSemester } from '../hooks/useSemesters';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { ArrowLeft, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const SemesterDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const semesterId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  
  const { data: semester, isLoading } = useSemester(semesterId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!semester) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900">Semester not found</h3>
        <p className="text-slate-500 mt-2">The semester you are looking for does not exist.</p>
        <Button className="mt-4" onClick={() => navigate('/administration/semesters')}>
          Back to List
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/administration/semesters')}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              {semester.semesterName} {semester.year}
              {semester.isCurrentSemester && (
                <Badge variant="success">Current</Badge>
              )}
            </h1>
            <p className="text-sm text-slate-500 mt-1">Code: {semester.semesterCode}</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/administration/semesters/${semester.id}/edit`)}>
          Edit Semester
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 mb-4 border-b pb-2">
            <Calendar size={20} />
            <h2 className="text-lg font-semibold text-slate-800">Academic Timeline</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Duration</p>
              <p className="text-slate-900">{formatDate(semester.startDate)} - {formatDate(semester.endDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Result Publish Date</p>
              <p className="text-slate-900">{formatDate(semester.resultPublishDate)}</p>
            </div>
          </div>
        </div>

        {/* Registration Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-emerald-600 mb-4 border-b pb-2">
            <Clock size={20} />
            <h2 className="text-lg font-semibold text-slate-800">Registration Timeline</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Registration Period</p>
              <p className="text-slate-900">{formatDate(semester.registrationStartDate)} - {formatDate(semester.registrationEndDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Status</p>
              <div className="flex items-center gap-2 mt-1">
                {semester.isActive ? (
                  <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                    <CheckCircle2 size={16} /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-500 text-sm font-medium">
                    <XCircle size={16} /> Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Audit Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-2">
           <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Audit Information</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Created By</p>
                <p className="text-slate-900 text-sm">{semester.createdBy?.firstName} {semester.createdBy?.lastName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Created At</p>
                <p className="text-slate-900 text-sm">{formatDate(semester.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Updated By</p>
                <p className="text-slate-900 text-sm">{semester.updatedBy ? `${semester.updatedBy.firstName} ${semester.updatedBy.lastName}` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Updated At</p>
                <p className="text-slate-900 text-sm">{semester.updatedAt ? formatDate(semester.updatedAt) : 'N/A'}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
