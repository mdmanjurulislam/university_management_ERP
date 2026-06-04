import axiosInstance from '../../../api/axios';
import type { EnrollStudentDto, UpdateStudentDto, Student, StudentApiResponse, PaginatedResponse, StudentListItem } from '../types';

export const studentService = {
  enrollStudent: async (data: EnrollStudentDto): Promise<StudentApiResponse<Student>> => {
    const response = await axiosInstance.post('/students/enroll', data);
    return response.data;
  },

  updateStudent: async (id: number, data: UpdateStudentDto): Promise<StudentApiResponse<Student>> => {
    const response = await axiosInstance.put(`/students/update/${id}`, data);
    return response.data;
  },

  getStudentById: async (id: number): Promise<StudentApiResponse<Student>> => {
    const response = await axiosInstance.get(`/students/${id}`);
    return response.data;
  },

  getStudentByStudentId: async (studentId: string): Promise<StudentApiResponse<Student>> => {
    const response = await axiosInstance.get(`/students/student-id/${studentId}`);
    return response.data;
  },

  getAllStudents: async (): Promise<StudentApiResponse<PaginatedResponse<StudentListItem>>> => {
    const response = await axiosInstance.get('/students/all');
    return response.data;
  },

  deleteStudent: async (id: number): Promise<StudentApiResponse<null>> => {
    const response = await axiosInstance.delete(`/students/${id}`);
    return response.data;
  }
};
