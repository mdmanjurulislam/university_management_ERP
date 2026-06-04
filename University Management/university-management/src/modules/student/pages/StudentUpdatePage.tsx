import React from 'react';
import { StudentForm } from '../components/StudentForm';
import { useUpdateStudent, useStudent } from '../hooks/useStudents';
import type { StudentFormData } from '../schemas/student.schema';
import { useNavigate, useParams } from 'react-router-dom';

export const StudentUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const studentId = parseInt(id || '0', 10);
  
  const { data: student, isLoading: isFetching } = useStudent(studentId);
  const { mutate: updateStudent, isPending } = useUpdateStudent();
  const navigate = useNavigate();

  const handleSubmit = (data: StudentFormData) => {
    updateStudent({ id: studentId, data: data as any }, {
      onSuccess: () => {
        navigate('/students');
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

  if (!student) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900">Student not found</h3>
        <p className="text-slate-500 mt-2">The student you are trying to edit does not exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Update Student Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Modify information for {student.fullName} ({student.studentId}).</p>
      </div>

      <StudentForm 
        initialData={student}
        onSubmit={handleSubmit} 
        isLoading={isPending} 
      />
    </div>
  );
};
