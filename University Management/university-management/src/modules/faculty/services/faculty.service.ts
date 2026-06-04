import axiosInstance from '../../../api/axios';
import type { EnrollFacultyDto, UpdateFacultyDto, Faculty, FacultyApiResponse, PaginatedFacultyResponse, FacultyListItem } from '../types';

export const facultyService = {
  enrollFaculty: async (data: EnrollFacultyDto): Promise<FacultyApiResponse<Faculty>> => {
    const response = await axiosInstance.post('/faculties/enroll', data);
    return response.data;
  },

  updateFaculty: async (id: number, data: UpdateFacultyDto): Promise<FacultyApiResponse<Faculty>> => {
    const response = await axiosInstance.put(`/faculties/${id}`, data);
    return response.data;
  },

  getFacultyById: async (id: number): Promise<FacultyApiResponse<Faculty>> => {
    const response = await axiosInstance.get(`/faculties/${id}`);
    return response.data;
  },

  getFacultyByCode: async (code: string): Promise<FacultyApiResponse<Faculty>> => {
    const response = await axiosInstance.get(`/faculties/code/${code}`);
    return response.data;
  },

  getAllFaculties: async (): Promise<FacultyApiResponse<PaginatedFacultyResponse<FacultyListItem>>> => {
    const response = await axiosInstance.get('/faculties');
    return response.data;
  },

  deleteFaculty: async (id: number): Promise<FacultyApiResponse<null>> => {
    const response = await axiosInstance.delete(`/faculties/${id}`);
    return response.data;
  }
};
