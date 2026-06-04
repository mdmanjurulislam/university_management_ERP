import api from '../../../api/axios';
import type { ProfileResponse, ProfileUpdateRequest, ChangePasswordRequest } from '../types';

export interface ApiResponse<T> {
  message: string;
  code: number;
  response: T;
}

export const profileService = {
  getMyProfile: async (): Promise<ApiResponse<ProfileResponse>> => {
    const response = await api.get('/profile/me');
    return response.data;
  },

  updateMyProfile: async (data: ProfileUpdateRequest): Promise<ApiResponse<ProfileResponse>> => {
    const response = await api.put('/profile/me', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<null>> => {
    const response = await api.put('/profile/change-password', data);
    return response.data;
  },
};
