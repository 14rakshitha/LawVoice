package com.lawvoice.controller;

import com.lawvoice.dto.AuthLoginRequest;
import com.lawvoice.dto.AuthRegisterRequest;
import com.lawvoice.dto.AuthResponse;
import com.lawvoice.dto.AuthUserDto;
import com.lawvoice.service.AuthService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody AuthRegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthLoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public AuthUserDto me(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return authService.me(extractToken(authorization));
    }

    @PostMapping("/profile")
    public AuthUserDto updateProfile(
            @RequestHeader("Authorization") String authorization,
            @RequestBody Map<String, Object> newProfile
    ) {
        return authService.updateProfile(extractToken(authorization), newProfile);
    }

    private String extractToken(String authorization) {
        if (authorization == null || authorization.isBlank()) {
            return "";
        }
        if (authorization.startsWith("Bearer ")) {
            return authorization.substring(7).trim();
        }
        return authorization.trim();
    }
}
