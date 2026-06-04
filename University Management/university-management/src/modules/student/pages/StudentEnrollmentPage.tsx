import React from 'react';
import { StudentForm } from '../components/StudentForm';
import { useEnrollStudent } from '../hooks/useStudents';
import type { StudentFormData } from '../schemas/student.schema';
import { useNavigate } from 'react-router-dom';

export const StudentEnrollmentPage: React.FC = () => {
  const { mutate: enrollStudent, isPending } = useEnrollStudent();
  const navigate = useNavigate();

  const handleSubmit = (data: StudentFormData) => {
    enrollStudent(data as any, {
      onSuccess: () => {
        navigate('/students');
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Enroll New Student</h1>
        <p className="text-sm text-slate-500 mt-1">Fill out the admission form to register a new student to the university.</p>
      </div>

      <StudentForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
};
