import React from 'react';
import { SemesterForm } from '../components/SemesterForm';
import { useCreateSemester } from '../hooks/useSemesters';
import type { SemesterFormData } from '../schemas/semester.schema';
import { useNavigate } from 'react-router-dom';

export const SemesterCreatePage: React.FC = () => {
  const { mutate: createSemester, isPending } = useCreateSemester();
  const navigate = useNavigate();

  const handleSubmit = (data: SemesterFormData) => {
    // The date fields are returned as YYYY-MM-DD from the form
    // The API might expect full ISO strings or specific formats, but YYYY-MM-DD usually works.
    // If needed, format them here.
    createSemester(data as any, {
      onSuccess: () => {
        navigate('/administration/semesters');
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create New Semester</h1>
        <p className="text-sm text-slate-500 mt-1">Configure academic and registration timelines for a new semester.</p>
      </div>

      <SemesterForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
};
