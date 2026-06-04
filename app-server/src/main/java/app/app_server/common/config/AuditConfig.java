package app.app_server.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import app.app_server.auth.model.UserPrinciple;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider", modifyOnCreate = false)
public class AuditConfig {

    @Bean
    public AuditorAware<Integer> auditorProvider() {
        return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
                return Optional.of(0); // Default to 0 or system user ID if no user is authenticated
            }
            
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserPrinciple) {
                return Optional.of(((UserPrinciple) principal).getId());
            }
            
            return Optional.of(0);
        };
    }
}
