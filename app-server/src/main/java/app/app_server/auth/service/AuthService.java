package app.app_server.auth.service;

import app.app_server.auth.dto.request.LoginRequestDTO;
import app.app_server.auth.dto.request.TokenRefreshRequestDTO;
import app.app_server.auth.dto.response.AuthResponseDTO;
import app.app_server.auth.dto.response.TokenRefreshResponseDTO;
import app.app_server.auth.model.RefreshToken;
import app.app_server.auth.model.Users;
import app.app_server.auth.repository.UserRepo;
import app.app_server.common.CommonResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private UserRepo userRepo;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public String encodedPassword(String password) {
        return encoder.encode(password);
    }

    /**
     * Authenticates user and returns Access + Refresh tokens.
     */
    public CommonResponse<AuthResponseDTO> login(LoginRequestDTO dto) {
        Users user = userRepo.findByUserName(dto.getUserName());
        if (user == null) {
            return CommonResponse.<AuthResponseDTO>builder()
                    .message("User not found")
                    .code(404)
                    .build();
        }

        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getUserName(), dto.getUserPassword())
            );

            if (authentication.isAuthenticated()) {
                String accessToken = jwtService.generateToken(dto.getUserName());
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(dto.getUserName());

                AuthResponseDTO response = new AuthResponseDTO(
                        accessToken,
                        refreshToken.getToken(),
                        user.getUserName(),
                        user.getRole()
                );

                return CommonResponse.<AuthResponseDTO>builder()
                        .message("Login Successful")
                        .response(response)
                        .code(200)
                        .build();
            }
        } catch (Exception e) {
            return CommonResponse.<AuthResponseDTO>builder()
                    .message("Authentication failed: " + e.getMessage())
                    .code(401)
                    .build();
        }

        return CommonResponse.<AuthResponseDTO>builder()
                .message("Login Failed")
                .code(400)
                .build();
    }

    /**
     * Refreshes the Access Token using a valid Refresh Token.
     * Implements Refresh Token Rotation (generates a new RT).
     */
    @Transactional
    public CommonResponse<TokenRefreshResponseDTO> refreshToken(TokenRefreshRequestDTO request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    // Generate new Access Token
                    String accessToken = jwtService.generateToken(user.getUserName());
                    
                    // Rotate Refresh Token: Delete old, create new
                    refreshTokenService.deleteByUserId(user.getUserId());
                    RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getUserName());

                    TokenRefreshResponseDTO response = new TokenRefreshResponseDTO(accessToken, newRefreshToken.getToken());
                    
                    return CommonResponse.<TokenRefreshResponseDTO>builder()
                            .message("Token refreshed successfully")
                            .response(response)
                            .code(200)
                            .build();
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    /**
     * Logs out the user by deleting their refresh token.
     */
    @Transactional
    public CommonResponse<String> logout(int userId) {
        refreshTokenService.deleteByUserId(userId);
        return CommonResponse.<String>builder()
                .message("Logged out successfully")
                .code(200)
                .build();
    }
}
