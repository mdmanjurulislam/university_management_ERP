package app.app_server.student.dto.response;

import app.app_server.department.dto.response.DepartmentResponseDTO;
import app.app_server.semester.dto.response.SemesterResponse;
import app.app_server.student.enums.Gender;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class StudentResponse {
    private Integer id;
    private String studentId;
    private String fullName;
    private String email;
    private String phone;
    private Gender gender;
    private String bloodGroup;
    private LocalDate dateOfBirth;
    private LocalDate admissionDate;
    private String address;
    private Integer batchYear;
    private String guardianName;
    private String guardianPhone;
    private DepartmentResponseDTO department;
    private SemesterResponse semester;
    private Boolean isActive;
    private Integer createdBy;
    private LocalDateTime createdAt;
    private Integer updatedBy;
    private LocalDateTime updatedAt;
}
