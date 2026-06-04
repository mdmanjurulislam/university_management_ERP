package app.app_server.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for login requests.
 *
 * Previously, the controller accepted a full Users entity for login
 * (which had ~8 fields). Now we only accept exactly what is needed:
 * userName and userPassword. This makes the API cleaner and safer.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDTO {

    @NotBlank(message = "Username is required")
    private String userName;

    @NotBlank(message = "Password is required")
    private String userPassword;
}
