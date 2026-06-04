import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Edit, Trash2, UserCheck, Users as UsersIcon, Eye } from 'lucide-react';
import { DataTable } from '../../../shared/components/ui/DataTable';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import type { User } from '../types/user.types';
import { Avatar, AvatarFallback, AvatarImage } from '../../../shared/components/ui/Avatar';
import { format } from 'date-fns';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger
} from '../../../shared/components/ui/Modal';
import { UserForm } from '../components/UserForm';
import { useUsers } from '../hooks/useUsers';
import { cn } from '../../../shared/utils/cn';
import { GraduationCap } from 'lucide-react';
import { ConfirmationModal } from '../../../shared/components/ui/ConfirmationModal';
import { useAuth } from '../../auth/context/AuthContext';

export const UserManagementPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { users, isLoading, createUser, updateUser, deleteUser, isDeleting } = useUsers();
  const [isOpen, setIsOpen] = React.useState(false);
  const [viewingUser, setViewingUser] = React.useState<User | null>(null);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [deletingUser, setDeletingUser] = React.useState<User | null>(null);

  const handleSubmit = (data: any) => {
    if (editingUser) {
      updateUser(
        { userId: editingUser.userId, ...data },
        { onSuccess: () => setIsOpen(false) }
      );
    } else {
      createUser(data, {
        onSuccess: () => setIsOpen(false)
      });
    }
  };

  const handleDelete = () => {
    if (deletingUser) {
      deleteUser(deletingUser.userId, {
        onSuccess: () => setDeletingUser(null)
      });
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      id: 'serialNumber',
      header: 'S.N.',
      cell: ({ row }) => <span className="font-mono text-xs text-slate-400">{row.index + 1}</span>,
    },
    {
      accessorKey: 'userName',
      header: 'User',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userName}`} />
              <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-slate-900">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-slate-500">@{user.userName}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return (
          <Badge variant={role === 'ADMIN' ? 'default' : role === 'FACULTY' ? 'info' : 'secondary'}>
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean;
        return (
          <Badge variant={isActive ? 'success' : 'destructive'}>
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </Badge>
        );
      },
    },
    {
      id: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => {
        const date = row.original.createdAt;
        if (!date) return <span className="text-xs text-slate-400">-</span>;
        try {
          return <span className="text-xs text-slate-500">{format(new Date(date), 'MMM dd, yyyy HH:mm')}</span>;
        } catch (e) {
          return <span className="text-xs text-slate-400">Invalid Date</span>;
        }
      },
    },
    {
      id: 'createdBy',
      header: 'Created By',
      cell: ({ row }) => {
        const user = row.original.createdBy;
        if (!user) return <span className="text-xs text-slate-400">-</span>;
        return <span className="text-xs text-slate-500">{user.userName}</span>;
      },
    },
    {
      id: 'updatedAt',
      header: 'Updated At',
      cell: ({ row }) => {
        const date = row.original.updatedAt;
        if (!date) return <span className="text-xs text-slate-400">-</span>;
        try {
          return <span className="text-xs text-slate-500">{format(new Date(date), 'MMM dd, yyyy HH:mm')}</span>;
        } catch (e) {
          return <span className="text-xs text-slate-400">Invalid Date</span>;
        }
      },
    },
    {
      id: 'updatedBy',
      header: 'Updated By',
      cell: ({ row }) => {
        const user = row.original.updatedBy;
        if (!user) return <span className="text-xs text-slate-400">-</span>;
        return <span className="text-xs text-slate-500">{user.userName}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const userRow = row.original;
        const isOwner = currentUser?.userName === userRow.userName;
        const isAdmin = currentUser?.role === 'ADMIN';
        const canManage = isAdmin || isOwner;

        if (!canManage) return <span className="text-xs text-slate-300 italic px-2">Restricted</span>;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
              onClick={() => setViewingUser(userRow)}
              title="View Details"
            >
              <Eye size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => {
                setEditingUser(userRow);
                setIsOpen(true);
              }}
              title="Edit User"
            >
              <Edit size={16} />
            </Button>

            {isAdmin && (
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setDeletingUser(userRow)}
                title="Delete User"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Administration</h1>
          <p className="text-slate-500 text-sm mt-1">Manage accounts for students, faculty, and administrators.</p>
        </div>

        <Modal open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setEditingUser(null);
        }}>
          {currentUser?.role === 'ADMIN' && (
            <ModalTrigger asChild>
              <Button className="shrink-0 gap-2 shadow-lg shadow-indigo-100 px-6">
                <Plus size={18} />
                Create User
              </Button>
            </ModalTrigger>
          )}
          <ModalContent className="max-w-2xl">
            <ModalHeader>
              <ModalTitle>{editingUser ? 'Update User Information' : 'Register New User'}</ModalTitle>
            </ModalHeader>
            <UserForm
              initialData={editingUser ? {
                firstName: editingUser.firstName,
                lastName: editingUser.lastName,
                userName: editingUser.userName,
                role: editingUser.role,
              } : undefined}
              onSubmit={handleSubmit}
              onCancel={() => setIsOpen(false)}
              isLoading={isLoading}
            />
          </ModalContent>
        </Modal>

        {/* View Modal */}
        <Modal open={!!viewingUser} onOpenChange={() => setViewingUser(null)}>
          <ModalContent className="max-w-md">
            <ModalHeader>
              <ModalTitle>User Details</ModalTitle>
            </ModalHeader>
            {viewingUser && (
              <div className="space-y-6 pt-4">
                <div className="flex flex-col items-center gap-4 py-4 bg-slate-50 rounded-3xl border border-slate-100">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${viewingUser.userName}`} />
                    <AvatarFallback>{viewingUser.firstName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-black text-slate-900">{viewingUser.firstName} {viewingUser.lastName}</h3>
                    <p className="text-indigo-600 font-bold text-sm">@{viewingUser.userName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Account Role</p>
                    <Badge variant={viewingUser.role === 'ADMIN' ? 'default' : 'secondary'}>{viewingUser.role}</Badge>
                  </div>
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Status</p>
                    <Badge variant={viewingUser.isActive ? 'success' : 'destructive'}>{viewingUser.isActive ? 'ACTIVE' : 'INACTIVE'}</Badge>
                  </div>
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl col-span-2">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Registered On</p>
                    <p className="font-mono text-slate-600">{viewingUser.createdAt ? format(new Date(viewingUser.createdAt), 'PPPP p') : '-'}</p>
                  </div>
                </div>
              </div>
            )}
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleDelete}
          title="Delete User Account"
          description={`Are you sure you want to delete ${deletingUser?.firstName}'s account? This action cannot be undone and will remove all associated data.`}
          confirmText="Yes, Delete Account"
          isLoading={isDeleting}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Accounts', value: users.length.toString(), icon: UsersIcon, color: 'bg-indigo-500' },
          { label: 'Active Users', value: users.filter(u => u.isActive).length.toString(), icon: UserCheck, color: 'bg-emerald-500' },
          { label: 'Administrators', value: users.filter(u => u.role === 'ADMIN').length.toString(), icon: GraduationCap, color: 'bg-amber-500' },
          { label: 'Recent Growth', value: '+12%', icon: Plus, color: 'bg-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className={cn("p-3 rounded-xl text-white shadow-inner", stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-1">
          <DataTable
            columns={columns}
            data={users}
            searchKey="userName"
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
