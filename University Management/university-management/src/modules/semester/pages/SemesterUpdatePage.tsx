import React from 'react';
import { SemesterForm } from '../components/SemesterForm';
import { useUpdateSemester, useSemester } from '../hooks/useSemesters';
import type { SemesterFormData } from '../schemas/semester.schema';
import { useNavigate, useParams } from 'react-router-dom';

export const SemesterUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const semesterId = parseInt(id || '0', 10);
  
  const { data: semester, isLoading: isFetching } = useSemester(semesterId);
  const { mutate: updateSemester, isPending } = useUpdateSemester();
  const navigate = useNavigate();

  const handleSubmit = (data: SemesterFormData) => {
    updateSemester({ id: semesterId, data: data as any }, {
      onSuccess: () => {
        navigate('/administration/semesters');
      }
    });
  };

  if (isFetching) {
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
        <p className="text-slate-500 mt-2">The semester you are trying to edit does not exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Update Semester</h1>
        <p className="text-sm text-slate-500 mt-1">Modify configuration for {semester.semesterName} {semester.year}.</p>
      </div>

      <SemesterForm 
        initialData={semester}
        onSubmit={handleSubmit} 
        isLoading={isPending} 
      />
    </div>
  );
};
