package app.app_server.auth.service;

import app.app_server.auth.dto.request.LoginRequestDTO;
import app.app_server.auth.dto.response.AuthResponseDTO;
import app.app_server.auth.model.UserPrinciple;
import app.app_server.auth.model.Users;
import app.app_server.auth.repository.UserRepo;
import app.app_server.common.CommonResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Service;

import java.util.HashMap;

/**
 * MyUserDetailsService — Implements Spring Security's UserDetailsService interface.
 *
 * Spring Security calls loadUserByUsername() automatically during authentication
 * to fetch user details from the database. We wrap the Users entity in a
 * UserPrinciple object (which implements UserDetails) so Spring Security
 * can work with it.
 *
 * CHANGE: The inner AuthService.verify() method now accepts LoginRequestDTO
 * instead of the raw Users entity, and returns AuthResponseDTO instead of a raw Map.
 */
@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    /**
     * Called automatically by Spring Security during login to load user details.
     * We look up the user by username from the database.
     * If not found, throw UsernameNotFoundException so Spring Security
     * returns a 401 Unauthorized response.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepo.findByUserName(username);

        if (user == null) {
            System.out.println("No user found with username: " + username);
            throw new UsernameNotFoundException("User not found: " + username);
        }

        // Wrap the entity in UserPrinciple (which implements UserDetails)
        return new UserPrinciple(user);
    }

}
