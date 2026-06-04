package app.app_server.department.dto.mapper;

import app.app_server.auth.dto.response.UserSummaryDTO;
import app.app_server.auth.repository.UserRepo;
import app.app_server.department.dto.request.DepartmentRequestDTO;
import app.app_server.department.dto.response.DepartmentResponseDTO;
import app.app_server.department.model.Department;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DepartmentMapper {

    @Autowired
    private UserRepo userRepo;

    public DepartmentResponseDTO toResponseDTO(Department department) {
        if (department == null) {
            return null;
        }

        DepartmentResponseDTO dto = new DepartmentResponseDTO();
        dto.setId(department.getId());
        dto.setDepartmentCode(department.getDepartmentCode());
        dto.setDepartmentName(department.getDepartmentName());
        dto.setShortName(department.getShortName());
        dto.setDescription(department.getDescription());
        
        dto.setIsActive(department.getIsActive());
        dto.setCreatedBy(getUserSummary(department.getCreatedBy()));
        dto.setCreatedAt(department.getCreatedAt());
        dto.setUpdatedBy(getUserSummary(department.getUpdatedBy()));
        dto.setUpdatedAt(department.getUpdatedAt());

        return dto;
    }

    public Department toEntity(DepartmentRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Department department = new Department();
        department.setDepartmentCode(dto.getDepartmentCode());
        department.setDepartmentName(dto.getDepartmentName());
        department.setShortName(dto.getShortName());
        department.setDescription(dto.getDescription());
        
        return department;
    }

    private UserSummaryDTO getUserSummary(Integer userId) {
        if (userId == null || userId == 0) return null;
        return userRepo.findById(userId)
                .map(u -> new UserSummaryDTO(u.getUserId(), u.getFirstName(), u.getLastName(), u.getUserName(), u.getRole()))
                .orElse(null);
    }
}
