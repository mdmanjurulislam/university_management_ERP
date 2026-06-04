import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { semesterService } from '../services/semester.service';
import type { CreateSemesterDto, UpdateSemesterDto } from '../types';
import toast from 'react-hot-toast';

export const useSemesters = () => {
  return useQuery({
    queryKey: ['semesters'],
    queryFn: async () => {
      const { response } = await semesterService.getAllSemesters();
      return response; // Assumes response.data.response holds the array
    },
  });
};

export const useSemester = (id: number) => {
  return useQuery({
    queryKey: ['semester', id],
    queryFn: async () => {
      const { response } = await semesterService.getSemesterById(id);
      return response;
    },
    enabled: !!id,
  });
};

export const useCreateSemester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSemesterDto) => semesterService.createSemester(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
      toast.success(data.message || 'Semester created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create semester');
    },
  });
};

export const useUpdateSemester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSemesterDto }) => 
      semesterService.updateSemester(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
      queryClient.invalidateQueries({ queryKey: ['semester', data.response.id] });
      toast.success(data.message || 'Semester updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update semester');
    },
  });
};

export const useDeleteSemester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => semesterService.deleteSemester(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
      toast.success(data.message || 'Semester deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete semester');
    },
  });
};
