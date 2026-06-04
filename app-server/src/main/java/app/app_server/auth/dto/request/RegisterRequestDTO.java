package app.app_server.auth.dto.request;

import app.app_server.auth.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO (Data Transfer Object) for user registration requests.
 *
 * WHY A DTO? — Instead of accepting the full Users entity (which contains
 * database-specific fields like userId, createdDateTime, etc.), we accept
 * only the fields the client needs to provide. This:
 *   1. Prevents over-posting attacks (client cannot set userId, active, etc.)
 *   2. Keeps API contract separate from database schema
 *   3. Allows independent validation rules per use-case
 *
 * LOMBOK ANNOTATIONS used:
 *   @Data            — generates getters, setters, toString, equals, hashCode
 *   @NoArgsConstructor  — generates the no-argument constructor (required by Jackson for JSON deserialization)
 *   @AllArgsConstructor — generates a constructor with all fields as parameters
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {

    // @NotBlank means the field must not be null AND must contain at least one non-whitespace character
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Username is required")
    private String userName;

    // @Size enforces minimum and maximum length on the password
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String userPassword;

    // Role is optional — the service layer defaults it to Role.USER if not provided
    private Role role;
}
