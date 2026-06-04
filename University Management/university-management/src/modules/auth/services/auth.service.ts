import api from '../../../api/axios';
import type { LoginFormValues } from '../schemas/login.schema';
import type { LoginResponse } from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginFormValues): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', {
      userName: credentials.userName,
      userPassword: credentials.userPassword,
    });
    return data;
  },

  refreshToken: async (token: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/refresh-token', {
      refreshToken: token,
    });
    return data;
  },
  
  logout: async () => {
    try {
      const { data } = await api.post('/auth/logout');
      return data;
    } catch (error) {
      console.error('API logout failed:', error);
      return null;
    } finally {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('user');
    }
  }
};
