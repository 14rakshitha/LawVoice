package com.lawvoice.dto;

import java.util.List;

public record AskResponse(
        String topic,
        String summary,
        List<String> steps,
        List<String> rights,
        List<String> nextActions,
        String disclaimer
) {}
