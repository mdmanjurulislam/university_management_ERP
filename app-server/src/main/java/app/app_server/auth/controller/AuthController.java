package app.app_server.auth.controller;

import app.app_server.auth.dto.request.LoginRequestDTO;
import app.app_server.auth.dto.request.TokenRefreshRequestDTO;
import app.app_server.auth.dto.response.AuthResponseDTO;
import app.app_server.auth.dto.response.TokenRefreshResponseDTO;
import app.app_server.auth.model.Users;
import app.app_server.auth.repository.UserRepo;
import app.app_server.auth.service.AuthService;
import app.app_server.common.CommonResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepo userRepo;

    /**
     * POST /api/auth/login
     * Authenticates user and returns Access Token + Refresh Token.
     *
     * Example Request:
     * {
     *   "userName": "johndoe",
     *   "userPassword": "password123"
     * }
     */
    @PostMapping("/login")
    public CommonResponse<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return authService.login(dto);
    }

    /**
     * POST /api/auth/refresh
     * Generates a new Access Token using a valid Refresh Token.
     * Implements Refresh Token Rotation.
     *
     * Example Request:
     * {
     *   "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
     * }
     */
    @PostMapping("/refresh")
    public CommonResponse<TokenRefreshResponseDTO> refreshToken(@Valid @RequestBody TokenRefreshRequestDTO request) {
        return authService.refreshToken(request);
    }

    /**
     * POST /api/auth/logout
     * Invalidates the user session by deleting the Refresh Token from the database.
     * 
     * Required Header:
     * Authorization: Bearer <Access_Token>
     * 
     * Example Request:
     * (Empty Body)
     */
    @PostMapping("/logout")
    public CommonResponse<String> logout(Principal principal) {
        if (principal == null) {
            return CommonResponse.<String>builder()
                    .message("No active session found")
                    .code(401)
                    .build();
        }
        Users user = userRepo.findByUserName(principal.getName());
        if (user != null) {
            return authService.logout(user.getUserId());
        }
        return CommonResponse.<String>builder()
                .message("User not found")
                .code(404)
                .build();
    }

    /**
     * Optional: CSRF token endpoint for clients that need it.
     */
    @GetMapping("/get-csrf")
    public CsrfToken getCsrfToken(HttpServletRequest request) {
        return (CsrfToken) request.getAttribute("_csrf");
    }
}
