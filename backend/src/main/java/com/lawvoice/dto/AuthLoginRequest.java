package com.lawvoice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AuthLoginRequest(
        @NotBlank @Pattern(regexp = "people|lawyer", flags = Pattern.Flag.CASE_INSENSITIVE) String role,
        // Either name or phone must be provided (validated in service layer)
        @Size(min = 2, max = 120) String name,
        @Size(min = 10, max = 15) String phone,
        @NotBlank @Size(min = 6, max = 100) String password
) {}
