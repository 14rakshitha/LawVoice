package com.lawvoice.dto;

import java.util.List;

public record LawyerItem(
        String id,
        String name,
        String category,
        String city,
        String phone,
        double rating,
        boolean verified,
        String experience,
        String barId,
        String bio,
        List<String> caseHistory
) {
    public LawyerItem(
            String id,
            String name,
            String category,
            String city,
            String phone,
            double rating,
            boolean verified,
            String experience,
            String barId,
            String bio
    ) {
        this(id, name, category, city, phone, rating, verified, experience, barId, bio, List.of());
    }
}
