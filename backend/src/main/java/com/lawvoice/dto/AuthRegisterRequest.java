package com.lawvoice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.Map;

public record AuthRegisterRequest(
        @NotBlank @Pattern(regexp = "people|lawyer", flags = Pattern.Flag.CASE_INSENSITIVE) String role,
        @NotBlank @Size(min = 2, max = 120) String name,
        @NotBlank @Size(min = 6, max = 100) String password,
        @NotBlank @Size(min = 8, max = 20) String phone,
        @NotBlank @Size(min = 2, max=80) String district,
        Map<String, Object> lawyerProfile
) {}
