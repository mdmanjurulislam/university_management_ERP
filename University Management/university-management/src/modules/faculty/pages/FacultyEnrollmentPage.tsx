import React from 'react';
import { FacultyForm } from '../components/FacultyForm';
import { useEnrollFaculty } from '../hooks/useFaculties';
import type { FacultyFormData } from '../schemas/faculty.schema';
import { useNavigate } from 'react-router-dom';

export const FacultyEnrollmentPage: React.FC = () => {
  const { mutate: enrollFaculty, isPending } = useEnrollFaculty();
  const navigate = useNavigate();

  const handleSubmit = (data: FacultyFormData) => {
    enrollFaculty(data as any, {
      onSuccess: () => {
        navigate('/faculties');
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Enroll New Faculty</h1>
        <p className="text-sm text-slate-500 mt-1">Fill out the admission form to register a new faculty member.</p>
      </div>

      <FacultyForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
};
