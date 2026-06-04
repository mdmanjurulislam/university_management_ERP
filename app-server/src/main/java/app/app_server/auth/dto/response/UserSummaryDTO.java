package app.app_server.auth.dto.response;

import app.app_server.auth.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDTO {
    private int userId;
    private String firstName;
    private String lastName;
    private String userName;
    private Role role;
}
