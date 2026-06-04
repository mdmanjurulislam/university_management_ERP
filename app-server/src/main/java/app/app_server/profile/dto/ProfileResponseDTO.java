package app.app_server.profile.dto;

import app.app_server.auth.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponseDTO {
    // Account Information
    private int id; // User's ID
    private String username;
    private String email;
    private Role role;
    private Boolean isActive;

    // Personal Information
    private String fullName;
    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String bloodGroup;
    private String address;

    // Student Specific
    private String studentId;
    private String department;
    private String semester;
    private LocalDate admissionDate;
    private String guardianName;
    private String guardianPhone;

    // Faculty Specific
    private String facultyCode;
    private String employeeId;
    private String designation;
    private LocalDate joiningDate;
    private String employmentType;
    private String qualification; // Highest Qualification
    private String specialization;
    private String officeRoom;
}
