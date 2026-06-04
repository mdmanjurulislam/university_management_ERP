package app.app_server.department.service.impl;

import app.app_server.common.CommonResponse;
import app.app_server.common.exception.DuplicateResourceException;
import app.app_server.common.exception.ResourceNotFoundException;
import app.app_server.department.dto.mapper.DepartmentMapper;
import app.app_server.department.dto.request.DepartmentRequestDTO;
import app.app_server.department.dto.response.DepartmentResponseDTO;
import app.app_server.department.model.Department;
import app.app_server.department.repository.DepartmentRepository;
import app.app_server.department.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DepartmentMapper departmentMapper;

    @Override
    public CommonResponse<DepartmentResponseDTO> createDepartment(DepartmentRequestDTO dto) {
        if (departmentRepository.existsByDepartmentCode(dto.getDepartmentCode())) {
            throw new DuplicateResourceException("Department with code '" + dto.getDepartmentCode() + "' already exists.");
        }

        Department department = departmentMapper.toEntity(dto);
        // BaseEntity sets isActive to true by default
        
        Department savedDepartment = departmentRepository.save(department);
        
        return CommonResponse.<DepartmentResponseDTO>builder()
                .message("Department created successfully")
                .response(departmentMapper.toResponseDTO(savedDepartment))
                .code(201)
                .build();
    }

    @Override
    public CommonResponse<DepartmentResponseDTO> updateDepartment(Integer id, DepartmentRequestDTO dto) {
        Department existingDepartment = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department with ID " + id + " not found."));

        if (!existingDepartment.getDepartmentCode().equals(dto.getDepartmentCode()) && 
            departmentRepository.existsByDepartmentCode(dto.getDepartmentCode())) {
            throw new DuplicateResourceException("Department with code '" + dto.getDepartmentCode() + "' already exists.");
        }

        existingDepartment.setDepartmentCode(dto.getDepartmentCode());
        existingDepartment.setDepartmentName(dto.getDepartmentName());
        existingDepartment.setShortName(dto.getShortName());
        existingDepartment.setDescription(dto.getDescription());
        
        Department updatedDepartment = departmentRepository.save(existingDepartment);
        
        return CommonResponse.<DepartmentResponseDTO>builder()
                .message("Department updated successfully")
                .response(departmentMapper.toResponseDTO(updatedDepartment))
                .code(200)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CommonResponse<DepartmentResponseDTO> getDepartmentById(Integer id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department with ID " + id + " not found."));
                
        return CommonResponse.<DepartmentResponseDTO>builder()
                .message("Department retrieved successfully")
                .response(departmentMapper.toResponseDTO(department))
                .code(200)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CommonResponse<List<DepartmentResponseDTO>> getAllDepartments() {
        List<DepartmentResponseDTO> departments = departmentRepository.findAll().stream()
                .map(departmentMapper::toResponseDTO)
                .collect(Collectors.toList());
                
        return CommonResponse.<List<DepartmentResponseDTO>>builder()
                .message("Departments retrieved successfully")
                .response(departments)
                .code(200)
                .build();
    }

    @Override
    public CommonResponse<String> deleteDepartment(Integer id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department with ID " + id + " not found."));
                
        // Soft delete
        department.setIsActive(false);
        departmentRepository.save(department);
        
        return CommonResponse.<String>builder()
                .message("Department deactivated successfully (soft delete).")
                .response("Department ID " + id + " deactivated.")
                .code(200)
                .build();
    }

    @Override
    public CommonResponse<DepartmentResponseDTO> toggleActiveStatus(Integer id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department with ID " + id + " not found."));
                
        department.setIsActive(!department.getIsActive());
        Department updatedDepartment = departmentRepository.save(department);
        
        return CommonResponse.<DepartmentResponseDTO>builder()
                .message("Department status updated successfully")
                .response(departmentMapper.toResponseDTO(updatedDepartment))
                .code(200)
                .build();
    }
}
