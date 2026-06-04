import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import type { ProfileUpdateRequest, ChangePasswordRequest } from '../types';
import toast from 'react-hot-toast';

export const useProfileDetails = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const data = await profileService.getMyProfile();
      return data.response;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileUpdateRequest) => profileService.updateMyProfile(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success(data.message || 'Profile updated successfully');
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMsg);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => profileService.changePassword(data),
    onSuccess: (data) => {
      toast.success(data.message || 'Password changed successfully');
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Failed to change password';
      toast.error(errorMsg);
    },
  });
};
