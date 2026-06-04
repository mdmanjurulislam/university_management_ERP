import { useState, useMemo } from 'react';
import { Plus, Building2, Pencil, Trash2, Eye } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { useDepartments } from '../hooks/useDepartments';
import type { Department, CreateDepartmentRequest, UpdateDepartmentRequest } from '../types/department.types';

import { DataTable } from '../../../shared/components/ui/DataTable';
import { Button } from '../../../shared/components/ui/Button';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '../../../shared/components/ui/Modal';
import { Badge } from '../../../shared/components/ui/Badge';
import { ConfirmationModal } from '../../../shared/components/ui/ConfirmationModal';

import { DepartmentForm } from '../components/DepartmentForm';
import { DepartmentViewModal } from '../components/DepartmentViewModal';

export function DepartmentManagement() {
  const {
    departments,
    isLoading,
    createDepartment,
    isCreating,
    updateDepartment,
    isUpdating,
    deleteDepartment,
    isDeleting,
  } = useDepartments();

  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // State for selected department
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  // Actions
  const handleCreate = () => {
    setSelectedDepartment(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setIsFormModalOpen(true);
  };

  const handleView = (department: Department) => {
    setSelectedDepartment(department);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (selectedDepartment) {
      updateDepartment(
        { id: selectedDepartment.id, ...data } as UpdateDepartmentRequest,
        { onSuccess: () => setIsFormModalOpen(false) }
      );
    } else {
      createDepartment(data as CreateDepartmentRequest, {
        onSuccess: () => setIsFormModalOpen(false),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedDepartment) {
      deleteDepartment(selectedDepartment.id, {
        onSuccess: () => setIsDeleteModalOpen(false),
      });
    }
  };

  // Table Columns
  const columns = useMemo<ColumnDef<Department>[]>(
    () => [
      {
        id: 'serialNumber',
        header: 'S.N.',
        cell: ({ row }) => <span className="font-mono text-xs text-slate-400">{row.index + 1}</span>,
      },
      {
        accessorKey: 'departmentCode',
        header: 'Code',
        cell: ({ row }) => <span className="font-semibold text-slate-700">{row.original.departmentCode}</span>,
      },
      {
        accessorKey: 'shortName',
        header: 'Short Name',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-slate-800">{row.original.shortName}</span>
          </div>
        ),
      },
      {
        accessorKey: 'departmentName',
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-slate-800">{row.original.departmentName}</span>
          </div>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <span className="text-slate-500 truncate max-w-[200px] inline-block" title={row.original.description}>
            {row.original.description}
          </span>
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
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: ({ row }) => (
          <span className="text-slate-500 whitespace-nowrap text-xs">
            {row.original.createdAt ? format(new Date(row.original.createdAt), 'MMM dd, yyyy HH:mm') : '-'}
          </span>
        ),
      },
      {
        id: 'createdBy',
        header: 'Created By',
        cell: ({ row }) => (
          <span className="text-slate-500 text-xs">
            {row.original.createdBy?.userName || '-'}
          </span>
        ),
      },
      {
        id: 'updatedAt',
        header: 'Updated At',
        cell: ({ row }) => (
          <span className="text-slate-500 whitespace-nowrap text-xs">
            {row.original.updatedAt ? format(new Date(row.original.updatedAt), 'MMM dd, yyyy HH:mm') : '-'}
          </span>
        ),
      },
      {
        id: 'updatedBy',
        header: 'Updated By',
        cell: ({ row }) => (
          <span className="text-slate-500 text-xs">
            {row.original.updatedBy?.userName || '-'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
              onClick={() => handleView(row.original)}
              title="View Details"
            >
              <Eye size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => handleEdit(row.original)}
              title="Edit Department"
            >
              <Pencil size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleDeleteClick(row.original)}
              title="Delete Department"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Header section with breadcrumb-like title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Building2 size={20} />
            <h1 className="text-2xl font-bold text-slate-800">Departments</h1>
          </div>
          <p className="text-slate-500 text-sm">
            Manage university departments, codes, and details.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shadow-sm">
          <Plus size={18} />
          Add Department
        </Button>
      </div>

      {/* Grid section */}
      <DataTable
        columns={columns}
        data={departments}
        isLoading={isLoading}
        searchKey="departmentName"
      />

      {/* Modals */}
      <Modal
        open={isFormModalOpen}
        onOpenChange={(open) => {
          setIsFormModalOpen(open);
          if (!open) setSelectedDepartment(null);
        }}
      >
        <ModalContent className="max-w-xl">
          <ModalHeader>
            <ModalTitle>{selectedDepartment ? 'Edit Department' : 'Create Department'}</ModalTitle>
          </ModalHeader>
          <DepartmentForm
            initialData={selectedDepartment}
            onSubmit={handleFormSubmit}
            isLoading={isCreating || isUpdating}
            onCancel={() => setIsFormModalOpen(false)}
          />
        </ModalContent>
      </Modal>

      <DepartmentViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        department={selectedDepartment}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        description={`Are you sure you want to delete the department "${selectedDepartment?.departmentName}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
