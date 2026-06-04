import axiosInstance from '../../../api/axios';
import type { ApiResponse, CreateSemesterDto, Semester, UpdateSemesterDto } from '../types';

export const semesterService = {
  createSemester: async (data: CreateSemesterDto): Promise<ApiResponse<Semester>> => {
    const response = await axiosInstance.post('/semesters/create', data);
    return response.data;
  },

  updateSemester: async (id: number, data: UpdateSemesterDto): Promise<ApiResponse<Semester>> => {
    const response = await axiosInstance.put(`/semesters/update/${id}`, data);
    return response.data;
  },

  getSemesterById: async (id: number): Promise<ApiResponse<Semester>> => {
    // Assuming you have a get by id endpoint like this, otherwise adjust as needed.
    const response = await axiosInstance.get(`/semesters/${id}`);
    return response.data;
  },

  getAllSemesters: async (): Promise<ApiResponse<Semester[]>> => {
    const response = await axiosInstance.get('/semesters/all');
    return response.data;
  },

  deleteSemester: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete(`/semesters/${id}`);
    return response.data;
  }
};
