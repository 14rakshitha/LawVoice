package com.lawvoice.dto;

import jakarta.validation.constraints.NotBlank;

public record AskRequest(@NotBlank String userId, @NotBlank String query, String language) {}
