import React from 'react';
import { FacultyForm } from '../components/FacultyForm';
import { useUpdateFaculty, useFaculty } from '../hooks/useFaculties';
import type { FacultyFormData } from '../schemas/faculty.schema';
import { useNavigate, useParams } from 'react-router-dom';

export const FacultyUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const facultyId = parseInt(id || '0', 10);
  
  const { data: faculty, isLoading: isFetching } = useFaculty(facultyId);
  const { mutate: updateFaculty, isPending } = useUpdateFaculty();
  const navigate = useNavigate();

  const handleSubmit = (data: FacultyFormData) => {
    updateFaculty({ id: facultyId, data: data as any }, {
      onSuccess: () => {
        navigate('/faculties');
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

  if (!faculty) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900">Faculty not found</h3>
        <p className="text-slate-500 mt-2">The faculty member you are trying to edit does not exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Update Faculty Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Modify information for {faculty.fullName} ({faculty.facultyCode}).</p>
      </div>

      <FacultyForm 
        initialData={faculty}
        onSubmit={handleSubmit} 
        isLoading={isPending} 
      />
    </div>
  );
};
