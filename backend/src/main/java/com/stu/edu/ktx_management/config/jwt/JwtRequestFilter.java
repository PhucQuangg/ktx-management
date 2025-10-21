    package com.stu.edu.ktx_management.config.jwt;

    import com.stu.edu.ktx_management.service.user.CustomUserDetailsService;
    import jakarta.servlet.http.Cookie;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.security.core.Authentication;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.core.userdetails.UserDetails;
    import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
    import org.springframework.stereotype.Component;
    import org.springframework.web.filter.OncePerRequestFilter;

    import jakarta.servlet.FilterChain;
    import jakarta.servlet.ServletException;
    import jakarta.servlet.http.HttpServletRequest;
    import jakarta.servlet.http.HttpServletResponse;
    import java.io.IOException;

    @Component
    public class JwtRequestFilter extends OncePerRequestFilter {

        @Autowired
        private JwtUtil jwtUtil;

        @Autowired
        private CustomUserDetailsService userDetailsService;

        @Override
        protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
            String path = request.getServletPath();
            return path.equals("/")
                    || path.equals("/api/auth/login")
                    || path.equals("/api/auth/register")
                    || path.startsWith("/api/auth/forgot-password")
                    || path.startsWith("/api/auth/reset-password");
        }


        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
                throws ServletException, IOException {

            String jwt = null;
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie c : cookies) {
                    if ("token".equals(c.getName()) && c.getValue() != null && !c.getValue().isEmpty()) {
                        jwt = c.getValue();
                    }
                }
            }


            if (jwt != null) {
                String username = jwtUtil.extractUsername(jwt);
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails ud = userDetailsService.loadUserByUsername(username);
                    if (jwtUtil.isTokenValid(jwt, ud.getUsername())) {
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(ud, null, ud.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }

            chain.doFilter(request, response);
        }

    }
