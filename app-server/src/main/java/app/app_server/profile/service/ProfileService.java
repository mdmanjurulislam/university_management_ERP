package app.app_server.profile.service;

import app.app_server.profile.dto.ProfileResponseDTO;
import app.app_server.profile.dto.ProfileUpdateRequestDTO;
import app.app_server.profile.dto.ChangePasswordRequestDTO;

public interface ProfileService {
    ProfileResponseDTO getProfile(String username);
    ProfileResponseDTO updateProfile(String username, ProfileUpdateRequestDTO dto);
    void changePassword(String username, ChangePasswordRequestDTO dto);
}
