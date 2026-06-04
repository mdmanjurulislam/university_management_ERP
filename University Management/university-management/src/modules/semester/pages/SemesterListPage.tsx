import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { useSemesters, useDeleteSemester } from '../hooks/useSemesters';
import type { Semester } from '../types';
import { DataTable } from '../../../shared/components/ui/DataTable';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { ConfirmationModal } from '../../../shared/components/ui/ConfirmationModal';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

export const SemesterListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: semesters, isLoading } = useSemesters();
  const { mutate: deleteSemester, isPending: isDeleting } = useDeleteSemester();
  
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      deleteSemester(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  const columns: ColumnDef<Semester>[] = [
    {
      accessorKey: 'semesterCode',
      header: 'Code',
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900">{row.original.semesterCode}</span>
      ),
    },
    {
      accessorKey: 'semesterName',
      header: 'Semester',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800">{row.original.semesterName} {row.original.year}</span>
          {row.original.isCurrentSemester && (
            <Badge variant="success" className="mt-1 w-fit">Current</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Academic Period',
      cell: ({ row }) => (
        <span className="text-slate-600">
          {new Date(row.original.startDate).toLocaleDateString()} - {new Date(row.original.endDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: 'registrationStartDate',
      header: 'Registration',
      cell: ({ row }) => (
        <span className="text-slate-600">
          {new Date(row.original.registrationStartDate).toLocaleDateString()} - {new Date(row.original.registrationEndDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'success' : 'secondary'}>
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
            onClick={() => navigate(`/administration/semesters/${row.original.id}`)}
            title="View Details"
          >
            <Eye className="w-4 h-4 text-slate-500" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/administration/semesters/${row.original.id}/edit`)}
            title="Edit Semester"
          >
            <Edit className="w-4 h-4 text-indigo-500" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setDeleteId(row.original.id)}
            title="Delete Semester"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Semester Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage academic semesters, timelines, and registration periods.</p>
        </div>
        <Button onClick={() => navigate('/administration/semesters/create')} className="gap-2">
          <Plus size={18} />
          Create Semester
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={semesters || []} 
        isLoading={isLoading} 
        searchKey="semesterCode"
      />

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Semester"
        description="Are you sure you want to delete this semester? This action cannot be undone and may affect associated academic records."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};
