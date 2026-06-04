import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '../services/department.service';
import toast from 'react-hot-toast';

export const useDepartments = () => {
  const queryClient = useQueryClient();

  const departmentsQuery = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAllDepartments,
  });

  const createDepartmentMutation = useMutation({
    mutationFn: departmentService.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create department');
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: departmentService.updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department updated successfully');
    },
    onError: (error: any) => {
      console.error('Update Department Error:', error);
      toast.error(error.response?.data?.message || 'Failed to update department');
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: departmentService.deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete department');
    },
  });

  return {
    departments: departmentsQuery.data ?? [],
    isLoading: departmentsQuery.isLoading,
    isError: departmentsQuery.isError,
    createDepartment: createDepartmentMutation.mutate,
    isCreating: createDepartmentMutation.isPending,
    updateDepartment: updateDepartmentMutation.mutate,
    isUpdating: updateDepartmentMutation.isPending,
    deleteDepartment: deleteDepartmentMutation.mutate,
    isDeleting: deleteDepartmentMutation.isPending,
  };
};
