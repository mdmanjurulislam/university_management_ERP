package app.app_server.student.dto.request;

import app.app_server.student.enums.Gender;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentCreateRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid phone number format")
    private String phone;

    @NotNull(message = "Gender is required")
    private Gender gender;

    private String bloodGroup;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotNull(message = "Admission date is required")
    private LocalDate admissionDate;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    @NotNull(message = "Batch year is required")
    private Integer batchYear;

    @Size(max = 100, message = "Guardian name must not exceed 100 characters")
    private String guardianName;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid guardian phone number format")
    private String guardianPhone;

    @NotNull(message = "Department ID is required")
    private Integer departmentId;

    @NotNull(message = "Semester ID is required")
    private Integer semesterId;
}
