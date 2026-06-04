package app.app_server.auth.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                .cors(Customizer.withDefaults())
                .csrf(customizer -> customizer.disable())
//                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/user/create-user").permitAll() // Allow registration
                        .requestMatchers("/get-all-users", "/get-all-active-users").hasAuthority("ADMIN")
                        .requestMatchers("/student/**", "/subject/**", "/faculty/**", "/course/**").hasAuthority("ADMIN")
                        
                        // Department Module Security
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/departments/**").hasAnyAuthority("ADMIN", "STUDENT", "FACULTY")
                        .requestMatchers("/api/departments/**").hasAuthority("ADMIN")
                        
                        // Semester Module Security
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/semesters/**").hasAnyAuthority("ADMIN", "STUDENT", "FACULTY")
                        .requestMatchers("/api/semesters/**").hasAuthority("ADMIN")
                        
                        .requestMatchers("/course/get-all-assigned-course").hasAnyAuthority("STUDENT", "ADMIN", "FACULTY")
                        .requestMatchers("/course/select-course").hasAnyAuthority("STUDENT", "ADMIN")
                        .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults())               //        But what if I want to get rest access from my postman then I have to implement this
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
        //        http.formLogin(Customizer.withDefaults());            //        if I hit from my postman then my postman will respond a html form page code
    }

    @Bean
    public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder());
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
