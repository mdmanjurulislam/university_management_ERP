package app.app_server.faculty.dto.response;

import app.app_server.department.dto.response.DepartmentResponseDTO;
import app.app_server.faculty.enums.Designation;
import app.app_server.faculty.enums.EmploymentType;
import app.app_server.faculty.enums.Gender;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class FacultyResponse {
    private Integer id;
    private String facultyCode;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private Gender gender;
    private LocalDate dateOfBirth;
    private String bloodGroup;
    private String employeeId;
    private Designation designation;
    private LocalDate joiningDate;
    private EmploymentType employmentType;
    private String highestQualification;
    private String specialization;
    private String officeRoom;
    private DepartmentResponseDTO department;
    private Boolean isActive;
    private Integer createdBy;
    private LocalDateTime createdAt;
    private Integer updatedBy;
    private LocalDateTime updatedAt;
}
