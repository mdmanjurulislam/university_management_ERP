package app.app_server.auth.dto.response;

import app.app_server.auth.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for user data returned in API responses.
 *
 * CRITICAL RULE: This class intentionally has NO password field.
 * Even a BCrypt-hashed password should NEVER be sent to the client.
 *
 * Previously, the code returned the raw Users entity from getAllUser(),
 * which included the hashed password. This DTO fixes that security problem.
 *
 * Fields exposed to the client:
 *   - userId, firstName, lastName, userName (identity)
 *   - role (authorization level)
 *   - active (account status)
 *   - createdDateTime (audit info)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {

    private int userId;
    private String firstName;
    private String lastName;
    private String userName;
    private Role role;
    private Boolean isActive;
    private UserSummaryDTO createdBy;
    private LocalDateTime createdAt;
    private UserSummaryDTO updatedBy;
    private LocalDateTime updatedAt;
    // ⚠️ userPassword is intentionally NOT here — never expose passwords in responses
}
