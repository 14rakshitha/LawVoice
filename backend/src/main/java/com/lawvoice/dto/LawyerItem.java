package com.lawvoice.dto;

public record LawyerItem(
        String id,
        String name,
        String specialization,
        String city,
        String phone,
        double rating,
        boolean verified
) {}
