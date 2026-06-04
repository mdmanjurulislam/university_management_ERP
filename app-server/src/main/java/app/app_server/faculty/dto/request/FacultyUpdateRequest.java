package app.app_server.faculty.dto.request;

import app.app_server.faculty.enums.Designation;
import app.app_server.faculty.enums.EmploymentType;
import app.app_server.faculty.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FacultyUpdateRequest {

    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid phone number format")
    private String phone;

    private Gender gender;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @Size(max = 20, message = "Blood group must not exceed 20 characters")
    private String bloodGroup;

    private Designation designation;

    private EmploymentType employmentType;

    @Size(max = 100, message = "Highest qualification must not exceed 100 characters")
    private String highestQualification;

    @Size(max = 200, message = "Specialization must not exceed 200 characters")
    private String specialization;

    @Size(max = 50, message = "Office room must not exceed 50 characters")
    private String officeRoom;

    private Boolean isActive;
}
