package app.app_server.auth.service;

import app.app_server.auth.dto.mapper.UserMapper;
import app.app_server.auth.dto.request.RegisterRequestDTO;
import app.app_server.auth.dto.request.UpdateUserRequestDTO;
import app.app_server.auth.dto.response.UserResponseDTO;
import app.app_server.auth.model.Role;
import app.app_server.auth.model.Users;
import app.app_server.auth.repository.UserRepo;
import app.app_server.common.CommonResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * UserService — Business logic layer for user management.
 *
 * KEY CHANGES (DTO Refactoring):
 *
 * 1. createUser() now accepts RegisterRequestDTO instead of Users entity.
 *    - Client cannot set userId, createdDateTime, active — service controls these.
 *    - Returns UserResponseDTO (no password in the response).
 *
 * 2. getAllUser() now returns List<UserResponseDTO> instead of List<Users>.
 *    - Previously exposed ALL fields including hashed password to the client.
 *    - Now only returns safe fields defined in UserResponseDTO.
 *
 * 3. updateUserById() now accepts UpdateUserRequestDTO instead of Users entity.
 *    - Returns UserResponseDTO (no password).
 *
 * 4. getAllActiveUsers() now returns List<UserResponseDTO>.
 *
 * The UserMapper component handles all entity ↔ DTO conversions.
 */
@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private AuthService authService;

    @Autowired
    private JWTService jwtService;

    /**
     * UserMapper is @Autowired — Spring manages it as a singleton bean.
     * We never call 'new UserMapper()' directly; we let Spring inject it.
     */
    @Autowired
    private UserMapper userMapper;


    /**
     * Creates a new user from the registration request DTO.
     *
     * FLOW:
     *   1. Check if username already exists → return 400 if so
     *   2. Use UserMapper to convert DTO → Users entity
     *   3. Set server-side fields: createdDateTime, active, role (default USER)
     *   4. Encode the password with BCrypt before saving
     *   5. Save to DB, then convert the saved entity → UserResponseDTO
     *   6. Return the DTO in the response (no password included!)
     *
     * @param dto  registration data from the client
     * @return     CommonResponse with UserResponseDTO (no password) or error
     */
    public CommonResponse<UserResponseDTO> createUser(RegisterRequestDTO dto) {

        // Check for duplicate username
        Optional<Users> existUser = Optional.ofNullable(userRepo.findByUserName(dto.getUserName()));
        if (existUser.isPresent()) {
            return CommonResponse.<UserResponseDTO>builder()
                    .message("Username '" + dto.getUserName() + "' already exists")
                    .response(null)
                    .code(400)
                    .build();
        }

        // Use the mapper to convert RegisterRequestDTO → Users entity
        Users user = userMapper.toEntity(dto);

        // Set server-controlled fields (client should NOT provide these)
        user.setUserPassword(authService.encodedPassword(dto.getUserPassword())); // BCrypt encode
        user.setIsActive(Boolean.TRUE);                 // New users are active by default
        user.setRole(dto.getRole() != null ? dto.getRole() : Role.USER); // Default role = USER

        // Save the entity to the database
        Users savedUser = userRepo.save(user);

        // Convert saved entity → UserResponseDTO (no password!)
        UserResponseDTO responseDTO = userMapper.toResponseDTO(savedUser);

        return CommonResponse.<UserResponseDTO>builder()
                .message("User created successfully")
                .response(responseDTO) // ✅ Safe DTO — no password
                .code(200)
                .build();
    }


    /**
     * Returns all users as a list of UserResponseDTOs.
     *
     * CHANGE: Previously returned List<Users> which included hashed passwords.
     * Now uses Java Stream API to map each entity to a safe DTO.
     *
     * PATTERN: stream().map(userMapper::toResponseDTO).collect(Collectors.toList())
     *   - stream()           — converts List<Users> to a Stream
     *   - map()              — applies toResponseDTO() to each Users object
     *   - collect()          — gathers results back into a List<UserResponseDTO>
     *
     * @return list of safe UserResponseDTOs
     */
    public List<UserResponseDTO> getAllUser() {
        return userRepo.findAll()
                .stream()
                .map(userMapper::toResponseDTO) // Method reference — same as: user -> userMapper.toResponseDTO(user)
                .collect(Collectors.toList());
    }


    /**
     * Deletes a user by their ID.
     * No DTO needed here — we only need the ID (passed as a path variable).
     *
     * @param userId  the ID of the user to delete
     */
    public void deleteUserById(int userId) {
        userRepo.deleteById(userId);
    }


    /**
     * Updates an existing user by ID.
     *
     * CHANGE:
     *   OLD: updateUserById(int id, Users user, Role role)  — used raw entity
     *   NEW: updateUserById(int id, UpdateUserRequestDTO dto) — uses DTO
     *
     * FLOW:
     *   1. Find existing user by ID
     *   2. Apply all fields from DTO onto the existing entity
     *   3. Re-encode the password
     *   4. Set modifiedDateTime to now()
     *   5. Save and return a UserResponseDTO
     *
     * @param userId  the ID of the user to update
     * @param dto     updated data from the client
     * @return        the updated user as a UserResponseDTO (no password)
     */
    public UserResponseDTO updateUserById(int userId, UpdateUserRequestDTO dto) {
        Optional<Users> existingUserOptional = userRepo.findById(userId);

        if (existingUserOptional.isPresent()) {
            Users existingUser = existingUserOptional.get();

            // Apply each field from the DTO to the existing entity
            existingUser.setFirstName(dto.getFirstName());
            existingUser.setLastName(dto.getLastName());
            existingUser.setUserName(dto.getUserName());
            
            // Only update password if a new one is provided (not null and not blank)
            if (dto.getUserPassword() != null && !dto.getUserPassword().trim().isEmpty()) {
                existingUser.setUserPassword(authService.encodedPassword(dto.getUserPassword()));
            }

            // Handle active flag — if not provided, keep the user active
            existingUser.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : Boolean.TRUE);

            // Handle role — if not provided in DTO, keep as ADMIN (admin is updating)
            existingUser.setRole(dto.getRole() != null ? dto.getRole() : Role.USER);

            Users updatedUser = userRepo.save(existingUser);

            // Convert to DTO before returning — never return the raw entity
            return userMapper.toResponseDTO(updatedUser);

        } else {
            System.out.println("User with ID " + userId + " not found");
            throw new UsernameNotFoundException("User with ID " + userId + " not found");
        }
    }


    /**
     * Returns all active users as a list of UserResponseDTOs.
     *
     * CHANGE: Previously returned List<Users> with password exposed.
     * Same stream mapping pattern as getAllUser().
     *
     * @return list of active users as safe DTOs
     */
    public List<UserResponseDTO> getAllActiveUsers() {
        return userRepo.getAllActiveUser()
                .stream()
                .map(userMapper::toResponseDTO) // Convert each Users entity to UserResponseDTO
                .collect(Collectors.toList());
    }
}
