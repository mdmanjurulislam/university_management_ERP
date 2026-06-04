import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { useFaculties, useDeleteFaculty } from '../hooks/useFaculties';
import type { FacultyListItem } from '../types';
import { DataTable } from '../../../shared/components/ui/DataTable';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../shared/components/ui/Avatar';
import { ConfirmationModal } from '../../../shared/components/ui/ConfirmationModal';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

export const FacultyListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: faculties, isLoading } = useFaculties();
  const { mutate: deleteFaculty, isPending: isDeleting } = useDeleteFaculty();
  
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      deleteFaculty(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  const columns: ColumnDef<FacultyListItem>[] = [
    {
      accessorKey: 'facultyCode',
      header: 'Faculty Code',
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900">{row.original.facultyCode}</span>
      ),
    },
    {
      accessorKey: 'fullName',
      header: 'Faculty Profile',
      cell: ({ row }) => {
        const faculty = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${faculty.facultyCode}`} />
              <AvatarFallback>{faculty.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900">{faculty.fullName}</span>
              <span className="text-xs text-slate-500">{faculty.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'departmentName',
      header: 'Department',
      cell: ({ row }) => (
        <span className="text-slate-800 font-medium">{row.original.departmentName || '-'}</span>
      ),
    },
    {
      accessorKey: 'designation',
      header: 'Designation',
      cell: ({ row }) => {
        const designation = row.original.designation.replace('_', ' ');
        return <span className="text-slate-600 capitalize">{designation.toLowerCase()}</span>;
      },
    },
    {
      accessorKey: 'employmentType',
      header: 'Employment',
      cell: ({ row }) => {
        const type = row.original.employmentType.replace('_', ' ');
        return <span className="text-slate-600 capitalize">{type.toLowerCase()}</span>;
      },
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
            onClick={() => navigate(`/faculties/${row.original.id}`)}
            title="View Details"
          >
            <Eye className="w-4 h-4 text-slate-500" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/faculties/${row.original.id}/edit`)}
            title="Edit Faculty"
          >
            <Edit className="w-4 h-4 text-indigo-500" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setDeleteId(row.original.id)}
            title="Delete Faculty"
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
          <h1 className="text-2xl font-bold text-slate-900">Faculty Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all faculty members across departments.</p>
        </div>
        <Button onClick={() => navigate('/faculties/enroll')} className="gap-2 shrink-0">
          <Plus size={18} />
          Enroll New Faculty
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-1">
        <DataTable 
          columns={columns} 
          data={faculties || []} 
          isLoading={isLoading} 
          searchKey="facultyCode"
        />
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Faculty Record"
        description="Are you sure you want to delete this faculty member? This action cannot be undone."
        confirmText="Delete Faculty"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};
