package com.lawvoice.dto;

import java.util.Map;

public record AuthUserDto(
        Long id,
        String role,
        String name,
        String email,
        String phone,
        String district,
        Map<String, Object> lawyerProfile
) {}
