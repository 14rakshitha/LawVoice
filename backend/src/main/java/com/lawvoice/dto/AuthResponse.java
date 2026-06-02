package com.lawvoice.dto;

public record AuthResponse(
        String token,
        String message,
        AuthUserDto user
) {}
