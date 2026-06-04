import api from '../../../api/axios';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user.types';

interface CommonResponse<T> {
  message: string;
  response: T;
  code: number;
}

export const userService = {
  getUsers: async (): Promise<User[]> => {
    // If the backend suddenly started wrapping all responses, we'd need to handle it.
    // Based on previous info, get-all-users returns a raw array.
    const { data } = await api.get<User[]>('/user/get-all-users');
    return data;
  },

  createUser: async (user: CreateUserRequest): Promise<User> => {
    const { data } = await api.post<User>('/user/create-user', user);
    return data;
  },

  updateUser: async ({ userId, ...dto }: UpdateUserRequest): Promise<User> => {
    // Handling the CommonResponse<UserResponseDTO> wrapper from the controller
    const { data } = await api.put<CommonResponse<User>>(`/user/update-user/${userId}`, dto);
    
    // Check if data is wrapped in CommonResponse or is direct
    if (data && 'response' in data) {
      return data.response;
    }
    
    return data as unknown as User;
  },

  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/user/delete-user/${userId}`);
  },
};
