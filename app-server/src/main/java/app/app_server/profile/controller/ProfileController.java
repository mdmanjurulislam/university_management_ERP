package app.app_server.profile.controller;

import app.app_server.common.CommonResponse;
import app.app_server.profile.dto.ProfileResponseDTO;
import app.app_server.profile.dto.ProfileUpdateRequestDTO;
import app.app_server.profile.dto.ChangePasswordRequestDTO;
import app.app_server.profile.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class ProfileController {

    private final ProfileService profileService;

    /**
     * GET /api/profile/me
     * Fetch profile details of currently logged-in user.
     */
    @GetMapping("/me")
    public ResponseEntity<CommonResponse<ProfileResponseDTO>> getMyProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(CommonResponse.<ProfileResponseDTO>builder()
                    .message("Unauthorized: User not authenticated")
                    .code(401)
                    .build());
        }

        String username = principal.getName();
        log.info("API request to fetch profile for user: {}", username);
        ProfileResponseDTO response = profileService.getProfile(username);

        return ResponseEntity.ok(CommonResponse.<ProfileResponseDTO>builder()
                .message("Profile details fetched successfully")
                .code(200)
                .response(response)
                .build());
    }

    /**
     * PUT /api/profile/me
     * Update profile details of currently logged-in user.
     */
    @PutMapping("/me")
    public ResponseEntity<CommonResponse<ProfileResponseDTO>> updateMyProfile(
            @Valid @RequestBody ProfileUpdateRequestDTO request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(CommonResponse.<ProfileResponseDTO>builder()
                    .message("Unauthorized: User not authenticated")
                    .code(401)
                    .build());
        }

        String username = principal.getName();
        log.info("API request to update profile for user: {}", username);
        ProfileResponseDTO response = profileService.updateProfile(username, request);

        return ResponseEntity.ok(CommonResponse.<ProfileResponseDTO>builder()
                .message("Profile updated successfully")
                .code(200)
                .response(response)
                .build());
    }

    /**
     * PUT /api/profile/change-password
     * Update password for the currently logged-in user.
     */
    @PutMapping("/change-password")
    public ResponseEntity<CommonResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequestDTO request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(CommonResponse.<Void>builder()
                    .message("Unauthorized: User not authenticated")
                    .code(401)
                    .build());
        }

        String username = principal.getName();
        log.info("API request to change password for user: {}", username);
        profileService.changePassword(username, request);

        return ResponseEntity.ok(CommonResponse.<Void>builder()
                .message("Password changed successfully")
                .code(200)
                .build());
    }
}
