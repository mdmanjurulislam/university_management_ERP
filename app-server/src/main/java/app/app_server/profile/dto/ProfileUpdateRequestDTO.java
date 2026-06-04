package app.app_server.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProfileUpdateRequestDTO {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid phone number format")
    private String phone;

    @NotBlank(message = "Gender is required")
    private String gender;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Blood group is required")
    private String bloodGroup;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    // Faculty specific
    @Size(max = 100, message = "Highest qualification must not exceed 100 characters")
    private String qualification;

    @Size(max = 200, message = "Specialization must not exceed 200 characters")
    private String specialization;

    @Size(max = 50, message = "Office room must not exceed 50 characters")
    private String officeRoom;

    // Student specific (guardian/emergency contact)
    @Size(max = 100, message = "Guardian/Emergency contact name must not exceed 100 characters")
    private String guardianName;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid emergency contact number format")
    private String guardianPhone;
}
