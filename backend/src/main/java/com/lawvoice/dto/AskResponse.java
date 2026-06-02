package com.lawvoice.dto;

import java.util.List;

public record AskResponse(
        String topic,
        String category,
        String summary,
        List<String> steps,
        List<String> rights,
        List<String> nextActions,
        List<LawyerItem> suggestedLawyers,
        List<String> sources,
        String disclaimer
) {}
