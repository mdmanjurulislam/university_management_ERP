package app.app_server.auth.dto.request;

import app.app_server.auth.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for update user requests (PUT /update-user/{userId}).
 *
 * Separate from RegisterRequestDTO because update rules can differ.
 * For example: in some systems you might not allow changing the username
 * after registration — having a separate DTO makes that easy to enforce.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequestDTO {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Username is required")
    private String userName;

    // Password update is optional. If null/blank, the service keeps the existing password.
    private String userPassword;

    // Active flag — allows admin to deactivate a user during update
    private Boolean isActive;

    // Role — allows admin to change a user's role
    private Role role;
}
