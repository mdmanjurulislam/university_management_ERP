
import { Modal, ModalContent, ModalHeader, ModalTitle } from '../../../shared/components/ui/Modal';
import { Badge } from '../../../shared/components/ui/Badge';
import { format } from 'date-fns';
import type { Department } from '../types/department.types';

interface DepartmentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
}

export function DepartmentViewModal({ isOpen, onClose, department }: DepartmentViewModalProps) {
  if (!department) return null;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-2xl">
        <ModalHeader>
          <ModalTitle>Department Details</ModalTitle>
        </ModalHeader>
        <div className="space-y-6 pt-4">
        {/* Header Section */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {department.departmentName}
            </h3>
            <h3 className="text-lg font-semibold text-slate-800">
              {department.shortName}
            </h3>
            <p className="text-sm text-slate-500 mt-1">Code: {department.departmentCode}</p>
          </div>
          <Badge
            variant={department.isActive ? 'success' : 'destructive'}
            className="px-3 py-1 text-xs font-medium"
          >
            {department.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Description
            </h4>
            <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
              {department.description || 'No description available.'}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Created By
            </h4>
            <div className="text-sm text-slate-700 font-medium">
              {department.createdBy?.firstName} {department.createdBy?.lastName}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {department.createdBy?.userName}
            </div>
            {department.createdAt && (
              <div className="text-xs text-slate-400 mt-1">
                {format(new Date(department.createdAt), 'MMM dd, yyyy h:mm a')}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Last Updated By
            </h4>
            <div className="text-sm text-slate-700 font-medium">
              {department.updatedBy?.firstName} {department.updatedBy?.lastName}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {department.updatedBy?.userName}
            </div>
            {department.updatedAt && (
              <div className="text-xs text-slate-400 mt-1">
                {format(new Date(department.updatedAt), 'MMM dd, yyyy h:mm a')}
              </div>
            )}
          </div>
        </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
