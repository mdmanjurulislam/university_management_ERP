package app.app_server.department.dto.response;

import app.app_server.auth.dto.response.UserSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponseDTO {
    
    private Integer id;
    private String departmentCode;
    private String departmentName;
    private String shortName;
    private String description;
    
    // Audit fields from BaseEntity
    private Boolean isActive;
    private UserSummaryDTO createdBy;
    private LocalDateTime createdAt;
    private UserSummaryDTO updatedBy;
    private LocalDateTime updatedAt;
}
