package app.app_server.faculty.dto.request;

import app.app_server.faculty.enums.Designation;
import app.app_server.faculty.enums.EmploymentType;
import app.app_server.faculty.enums.Gender;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FacultyCreateRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid phone number format")
    private String phone;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @Size(max = 20, message = "Blood group must not exceed 20 characters")
    private String bloodGroup;

    @NotBlank(message = "Employee ID is required")
    @Size(max = 50, message = "Employee ID must not exceed 50 characters")
    private String employeeId;

    @NotNull(message = "Designation is required")
    private Designation designation;

    @NotNull(message = "Joining date is required")
    private LocalDate joiningDate;

    @NotNull(message = "Employment type is required")
    private EmploymentType employmentType;

    @Size(max = 100, message = "Highest qualification must not exceed 100 characters")
    private String highestQualification;

    @Size(max = 200, message = "Specialization must not exceed 200 characters")
    private String specialization;

    @Size(max = 50, message = "Office room must not exceed 50 characters")
    private String officeRoom;

    @NotNull(message = "Department ID is required")
    private Integer departmentId;
}
