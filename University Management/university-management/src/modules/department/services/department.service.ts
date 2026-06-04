import api from '../../../api/axios';
import type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from '../types/department.types';

interface CommonResponse<T> {
  message: string;
  response: T;
  code: number;
}

export const departmentService = {
  getAllDepartments: async (): Promise<Department[]> => {
    // Handling the array directly as some endpoints return standard array vs CommonResponse, 
    // the prompt shows it returns a wrapper `{"message": "...", "code": 200, "response": [...]}`
    const { data } = await api.get<CommonResponse<Department[]>>('/departments/all');
    
    if (data && data.response) {
      return data.response;
    }
    
    return data as unknown as Department[];
  },

  createDepartment: async (department: CreateDepartmentRequest): Promise<Department> => {
    // Prompt shows response wrapped in CommonResponse pattern
    const { data } = await api.post<CommonResponse<Department>>('/departments/create', department);
    
    if (data && data.response) {
      return data.response;
    }
    
    return data as unknown as Department;
  },

  updateDepartment: async ({ id, ...dto }: UpdateDepartmentRequest): Promise<Department> => {
    const { data } = await api.put<CommonResponse<Department>>(`/departments/update/${id}`, dto);
    
    if (data && data.response) {
      return data.response;
    }
    
    return data as unknown as Department;
  },

  deleteDepartment: async (id: number): Promise<void> => {
    await api.delete(`/departments/${id}`);
  },
};
