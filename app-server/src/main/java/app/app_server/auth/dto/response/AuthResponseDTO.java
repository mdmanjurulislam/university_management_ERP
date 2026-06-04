package app.app_server.auth.dto.response;

import app.app_server.auth.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for authentication (login) responses.
 *
 * Previously, the login response was built ad-hoc using a raw HashMap<String,String>
 * inside the service. Using a dedicated DTO:
 *   1. Makes the response structure explicit and documented
 *   2. Adds type safety (Role enum instead of plain string)
 *   3. Makes it easy to add new fields (e.g., tokenExpiry) in the future
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {

    // The JWT Access Token (short-lived)
    private String accessToken;

    // The Refresh Token (long-lived)
    private String refreshToken;

    // The authenticated user's username
    private String userName;

    // The user's role
    private Role role;
}
