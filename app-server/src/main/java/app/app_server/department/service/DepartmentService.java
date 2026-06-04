package app.app_server.department.service;

import app.app_server.common.CommonResponse;
import app.app_server.department.dto.request.DepartmentRequestDTO;
import app.app_server.department.dto.response.DepartmentResponseDTO;

import java.util.List;

public interface DepartmentService {
    
    CommonResponse<DepartmentResponseDTO> createDepartment(DepartmentRequestDTO dto);
    
    CommonResponse<DepartmentResponseDTO> updateDepartment(Integer id, DepartmentRequestDTO dto);
    
    CommonResponse<DepartmentResponseDTO> getDepartmentById(Integer id);
    
    CommonResponse<List<DepartmentResponseDTO>> getAllDepartments();
    
    CommonResponse<String> deleteDepartment(Integer id);
    
    CommonResponse<DepartmentResponseDTO> toggleActiveStatus(Integer id);
}
