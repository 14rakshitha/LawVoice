package com.lawvoice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AuthLoginRequest(
        @NotBlank @Pattern(regexp = "people|lawyer", flags = Pattern.Flag.CASE_INSENSITIVE) String role,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, max = 100) String password
) {}
