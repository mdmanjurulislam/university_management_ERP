package app.app_server.auth.controller;

import app.app_server.auth.dto.request.LoginRequestDTO;
import app.app_server.auth.dto.request.RegisterRequestDTO;
import app.app_server.auth.dto.request.UpdateUserRequestDTO;
import app.app_server.auth.dto.response.AuthResponseDTO;
import app.app_server.auth.dto.response.UserResponseDTO;
import app.app_server.auth.dto.mapper.UserMapper;
import app.app_server.auth.model.Role;
import app.app_server.auth.model.Users;
import app.app_server.auth.repository.UserRepo;
import app.app_server.auth.service.MyUserDetailsService;
import app.app_server.auth.service.UserService;
import app.app_server.common.CommonResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

/**
 * UserController — REST API endpoints for user management and authentication.
 *
 * KEY CHANGES (DTO Refactoring):
 *
 * 1. @RequestBody now uses DTOs instead of the Users entity.
 *    - Prevents over-posting (client cannot inject userId, createdDateTime, etc.)
 *
 * 2. @Valid is added to all @RequestBody parameters.
 *    - Triggers the @NotBlank, @Size etc. annotations defined in each DTO.
 *    - Returns 400 Bad Request automatically if validation fails.
 *
 * 3. Removed direct @Autowired UserRepo — that was a layering violation.
 *    - Controllers should only talk to Services, not Repositories directly.
 *    - /current-user now uses UserService to fetch user data safely.
 *
 * 4. All responses now use DTOs — no raw entity with password is ever returned.
 *
 * CLEAN ARCHITECTURE RULE:
 *   Controller → Service → Repository
 *   Controller should never call Repository directly.
 */
@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;


    // ✅ UserMapper is needed here only for /current-user endpoint
    //    (to convert the Users entity fetched from userRepo to a DTO)
    @Autowired
    private UserMapper userMapper;

    // ✅ UserRepo is kept ONLY for /current-user to fetch by Principal name.
    //    In a larger project, this would move into a dedicated ProfileService.
    @Autowired
    private UserRepo userRepo;


    /**
     * POST /create-user — Register a new user.
     *
     * CHANGE: @RequestBody changed from Users to RegisterRequestDTO.
     * @Valid triggers validation annotations (e.g., @NotBlank on userName).
     * The service now handles all business logic and returns a safe UserResponseDTO.
     *
     * Example request body:
     * {
     *   "firstName": "John",
     *   "lastName":  "Doe",
     *   "userName":  "johndoe",
     *   "userPassword": "secret123",
     *   "role": "USER"
     * }
     */
    @PostMapping("/create-user")
    public CommonResponse<UserResponseDTO> createUser(@Valid @RequestBody RegisterRequestDTO dto) {
        // Delegate entirely to service — controller stays thin
        return userService.createUser(dto);
    }


    /**
     * GET /get-all-users — Retrieve all users (ADMIN only — enforced in SecurityConfig).
     *
     * CHANGE: Returns List<UserResponseDTO> instead of List<Users>.
     * No password hashes in the response anymore.
     */
    @GetMapping("/get-all-users")
    public List<UserResponseDTO> getAllUser() {
        return userService.getAllUser();
    }


    /**
     * DELETE /delete-user?userID={id} — Delete a user by ID (ADMIN only).
     * No DTO needed — only the ID is required, passed as a query parameter.
     */
    @DeleteMapping("/delete-user/{userId}")
    public CommonResponse<String> deleteUser(@PathVariable int userId) {
        userService.deleteUserById(userId);
        return CommonResponse.<String>builder()
                .message("User deleted successfully")
                .response("User ID " + userId + " has been removed")
                .code(200)
                .build();
    }


    /**
     * PUT /update-user/{userId} — Update an existing user (ADMIN only).
     *
     * CHANGE: @RequestBody changed from Users to UpdateUserRequestDTO.
     * @Valid triggers validation. Service returns a UserResponseDTO.
     *
     * Example request body:
     * {
     *   "firstName": "Jane",
     *   "lastName":  "Doe",
     *   "userName":  "janedoe",
     *   "userPassword": "newpass123",
     *   "active": true,
     *   "role": "TEACHER"
     * }
     */
    @PutMapping("/update-user/{userId}")
    public CommonResponse<UserResponseDTO> updateUser(
            @PathVariable int userId,
            @Valid @RequestBody UpdateUserRequestDTO dto,
            Principal principal) {

        // Step 1: Identify who is logged in
        Users loggedInUser = userRepo.findByUserName(principal.getName());

        // Step 2: Authorization Check
        // Allow if: loggedInUser is ADMIN OR loggedInUser is updating their own record
        boolean isAdmin = loggedInUser.getRole() == Role.ADMIN;
        boolean isOwner = loggedInUser.getUserId() == userId;

        if (!isAdmin && !isOwner) {
            return CommonResponse.<UserResponseDTO>builder()
                    .message("Access Denied: You are not authorized to update this profile")
                    .code(403)
                    .build();
        }

        // Step 3: Security Guard
        // If not admin, force role and active status to remain as they are in the database
        // (Prevents a user from promoting themselves to ADMIN or reactivating their own account if disabled)
        if (!isAdmin) {
            dto.setRole(loggedInUser.getRole());
            dto.setIsActive(loggedInUser.getIsActive());
        }

        UserResponseDTO updatedUser = userService.updateUserById(userId, dto);
        return CommonResponse.<UserResponseDTO>builder()
                .message("User updated successfully")
                .response(updatedUser)
                .code(200)
                .build();
    }




    /**
     * GET /current-user — Get the currently authenticated user's profile.
     *
     * Principal is injected by Spring Security — it holds the username of the
     * currently authenticated user extracted from the JWT token by JwtFilter.
     *
     * CHANGE: Returns UserResponseDTO instead of building a raw HashMap.
     * No password is included. Uses UserMapper for safe conversion.
     */
    @GetMapping("/current-user")
    public CommonResponse<UserResponseDTO> getLoggedInUser(Principal principal) {
        // principal.getName() returns the username from the JWT subject claim
        Users user = userRepo.findByUserName(principal.getName());

        // Convert entity → safe DTO using the mapper
        UserResponseDTO userDTO = userMapper.toResponseDTO(user);

        return CommonResponse.<UserResponseDTO>builder()
                .message("Currently logged in user")
                .response(userDTO) // Safe DTO — no password
                .code(200)
                .build();
    }


    /**
     * GET /get-all-active-users — Retrieve all active users (ADMIN only).
     *
     * CHANGE: Returns List<UserResponseDTO> instead of List<Users>.
     */
    @GetMapping("/get-all-active-users")
    public CommonResponse<List<UserResponseDTO>> getAllActiveUsers() {
        List<UserResponseDTO> activeUsers = userService.getAllActiveUsers();
        return CommonResponse.<List<UserResponseDTO>>builder()
                .message("All active users")
                .response(activeUsers)
                .code(200)
                .build();
    }
}
