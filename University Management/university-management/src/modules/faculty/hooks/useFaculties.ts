import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facultyService } from '../services/faculty.service';
import type { EnrollFacultyDto, UpdateFacultyDto } from '../types';
import toast from 'react-hot-toast';

export const useFaculties = () => {
  return useQuery({
    queryKey: ['faculties'],
    queryFn: async () => {
      const data = await facultyService.getAllFaculties();
      return data.response.content;
    },
  });
};

export const useFaculty = (id: number) => {
  return useQuery({
    queryKey: ['faculty', id],
    queryFn: async () => {
      const data = await facultyService.getFacultyById(id);
      return data.response;
    },
    enabled: !!id,
  });
};

export const useEnrollFaculty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EnrollFacultyDto) => facultyService.enrollFaculty(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
      toast.success(`Faculty enrolled successfully. ID: ${data.response?.facultyCode || 'Generated'}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to enroll faculty');
    },
  });
};

export const useUpdateFaculty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFacultyDto }) => 
      facultyService.updateFaculty(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
      if (data.response?.id) {
        queryClient.invalidateQueries({ queryKey: ['faculty', data.response.id] });
      }
      toast.success(data.message || 'Faculty updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update faculty');
    },
  });
};

export const useDeleteFaculty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => facultyService.deleteFaculty(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
      toast.success(data.message || 'Faculty deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete faculty');
    },
  });
};
