package app.app_server.auth.dto.mapper;

import app.app_server.auth.dto.request.RegisterRequestDTO;
import app.app_server.auth.dto.response.UserResponseDTO;
import app.app_server.auth.dto.response.UserSummaryDTO;
import app.app_server.auth.model.Users;
import app.app_server.auth.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * UserMapper — Converts between the Users entity and DTOs.
 *
 * WHY MANUAL MAPPING instead of ModelMapper/MapStruct?
 *   - Zero external dependencies
 *   - Fully transparent — you can see exactly what gets mapped
 *   - No reflection magic that could accidentally expose password
 *   - Easy to learn and maintain for a student project
 *
 * PATTERN: This is a Spring @Component so it can be @Autowired into services.
 * Each method has a clear, single responsibility.
 */
@Component
public class UserMapper {

    @Autowired
    private UserRepo userRepo;

    /**
     * Converts a Users entity → UserResponseDTO.
     *
     * This is the most important method — it explicitly EXCLUDES userPassword,
     * modifiedDateTime, and other fields we don't want to expose to the client.
     *
     * @param user  the entity fetched from the database
     * @return      a safe DTO with no sensitive data
     */
    public UserResponseDTO toResponseDTO(Users user) {
        if (user == null) return null;

        UserResponseDTO dto = new UserResponseDTO();
        dto.setUserId(user.getUserId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setUserName(user.getUserName());
        dto.setRole(user.getRole());
        dto.setIsActive(user.getIsActive());
        dto.setCreatedBy(getUserSummary(user.getCreatedBy()));
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedBy(getUserSummary(user.getUpdatedBy()));
        dto.setUpdatedAt(user.getUpdatedAt());
        // ⚠️ userPassword is intentionally NOT mapped here
        return dto;
    }

    private UserSummaryDTO getUserSummary(Integer userId) {
        if (userId == null || userId == 0) return null;
        return userRepo.findById(userId)
                .map(u -> new UserSummaryDTO(u.getUserId(), u.getFirstName(), u.getLastName(), u.getUserName(), u.getRole()))
                .orElse(null);
    }

    /**
     * Converts a RegisterRequestDTO → Users entity (for saving to database).
     *
     * NOTE: This creates a new Users object from the incoming request data.
     * Fields like userId, createdDateTime, active are set by the service layer,
     * not here — because they depend on business logic (e.g., createdDateTime = now()).
     *
     * @param dto  the registration request from the client
     * @return     a partially populated Users entity (before saving)
     */
    public Users toEntity(RegisterRequestDTO dto) {
        if (dto == null) return null;

        Users user = new Users();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setUserName(dto.getUserName());
        // Raw password — the service will BCrypt-encode this before saving
        user.setUserPassword(dto.getUserPassword());
        user.setRole(dto.getRole());
        return user;
    }
}
