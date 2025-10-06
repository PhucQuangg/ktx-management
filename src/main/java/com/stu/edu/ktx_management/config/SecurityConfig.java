    package com.stu.edu.ktx_management.config;

    import com.stu.edu.ktx_management.config.jwt.JwtRequestFilter;
    import org.modelmapper.ModelMapper;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.context.annotation.*;
    import org.springframework.security.authentication.*;
    import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
    import org.springframework.security.config.http.SessionCreationPolicy;
    import org.springframework.security.web.*;
    import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.crypto.password.PasswordEncoder;

    @Configuration
    @EnableWebSecurity
    public class SecurityConfig {

        @Autowired
        private JwtRequestFilter jwtRequestFilter;
        @Bean
        public ModelMapper modelMapper() {
            return new ModelMapper();
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http.csrf().disable()
                    .authorizeHttpRequests(auth -> auth
                            .requestMatchers("/","/login","/register","/forgot-password","/api/auth/**").permitAll()
                            .requestMatchers( "/admin/**","/api/admin/**").hasRole("ADMIN")
                            .requestMatchers("/student/**", "/api/student/**").hasAnyRole("STUDENT","ADMIN")
                            .anyRequest().authenticated()
                    )
                    .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .logout(logout -> logout
                            .logoutUrl("/api/auth/logout")
                            .logoutSuccessHandler((request, response, authentication) -> {

                            })
                            .invalidateHttpSession(false)
                            .deleteCookies("token")
                    );



            http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
            return http.build();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
            return config.getAuthenticationManager();
        }

        @Bean
        WebSecurityCustomizer webSecurityCustomizer() {
            return web -> web.debug(true).ignoring()
                    .requestMatchers("/static/**", "/fe/**", "assets/**", "uploads/**");
        }
        @Bean
        public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }
    }
