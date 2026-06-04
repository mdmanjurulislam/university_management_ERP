package app.app_server.faculty.dto.response;

import app.app_server.faculty.enums.Designation;
import app.app_server.faculty.enums.EmploymentType;
import lombok.Data;

@Data
public class FacultyListResponse {
    private Integer id;
    private String facultyCode;
    private String fullName;
    private String email;
    private String phone;
    private String employeeId;
    private Designation designation;
    private EmploymentType employmentType;
    private String departmentName;
    private Boolean isActive;
}
