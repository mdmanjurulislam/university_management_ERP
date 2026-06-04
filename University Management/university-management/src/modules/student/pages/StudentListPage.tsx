import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { useStudents, useDeleteStudent } from '../hooks/useStudents';
import type { StudentListItem } from '../types';
import { DataTable } from '../../../shared/components/ui/DataTable';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../shared/components/ui/Avatar';
import { ConfirmationModal } from '../../../shared/components/ui/ConfirmationModal';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

export const StudentListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: students, isLoading } = useStudents();
  const { mutate: deleteStudent, isPending: isDeleting } = useDeleteStudent();
  
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      deleteStudent(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  const columns: ColumnDef<StudentListItem>[] = [
    {
      accessorKey: 'studentId',
      header: 'Student ID',
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900">{row.original.studentId}</span>
      ),
    },
    {
      accessorKey: 'fullName',
      header: 'Student Profile',
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.studentId}`} />
              <AvatarFallback>{student.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900">{student.fullName}</span>
              <span className="text-xs text-slate-500">{student.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'departmentName',
      header: 'Department',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-slate-800 font-medium">{row.original.departmentName || '-'}</span>
          <span className="text-xs text-slate-500">{row.original.batchYear} Batch</span>
        </div>
      ),
    },
    {
      accessorKey: 'semesterName',
      header: 'Semester',
      cell: ({ row }) => (
        <span className="text-slate-600">
          {row.original.semesterName}
        </span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <span className="text-slate-600">{row.original.phone}</span>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'success' : 'destructive'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/students/${row.original.id}`)}
            title="View Details"
          >
            <Eye className="w-4 h-4 text-slate-500" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/students/${row.original.id}/edit`)}
            title="Edit Student"
          >
            <Edit className="w-4 h-4 text-indigo-500" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setDeleteId(row.original.id)}
            title="Delete Student"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage enrolled students across all departments and semesters.</p>
        </div>
        <Button onClick={() => navigate('/students/enroll')} className="gap-2 shrink-0">
          <Plus size={18} />
          Enroll New Student
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-1">
        <DataTable 
          columns={columns} 
          data={students || []} 
          isLoading={isLoading} 
          searchKey="studentId"
        />
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Student Record"
        description="Are you sure you want to delete this student? This action cannot be undone and will remove all associated academic data."
        confirmText="Delete Student"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};
