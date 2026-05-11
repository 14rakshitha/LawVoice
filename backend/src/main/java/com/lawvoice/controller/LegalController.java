package com.lawvoice.controller;

import com.lawvoice.dto.AskRequest;
import com.lawvoice.dto.AskResponse;
import com.lawvoice.dto.EmergencyItem;
import com.lawvoice.dto.FaqItem;
import com.lawvoice.dto.LawyerItem;
import com.lawvoice.model.QueryHistory;
import com.lawvoice.service.LegalAssistantService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class LegalController {
    private final LegalAssistantService service;

    public LegalController(LegalAssistantService service) {
        this.service = service;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "running");
    }

    @PostMapping("/legal/ask")
    public AskResponse ask(@Valid @RequestBody AskRequest request) {
        return service.answer(request);
    }

    @GetMapping("/fir/guide")
    public AskResponse firGuide() {
        return service.firResponse();
    }

    @GetMapping("/faqs")
    public List<FaqItem> faqs() {
        return service.faqs();
    }

    @GetMapping("/lawyers")
    public List<LawyerItem> lawyers() {
        return service.lawyers();
    }

    @GetMapping("/emergency")
    public List<EmergencyItem> emergency() {
        return service.emergency();
    }

    @GetMapping("/history/{userId}")
    public List<QueryHistory> history(@PathVariable String userId) {
        return service.history(userId);
    }

    @PostMapping("/admin/content")
    public Map<String, String> saveContent(@RequestBody Map<String, String> body) {
        return Map.of("message", "உள்ளடக்கம் ஆய்வுக்காக சேமிக்கப்பட்டது", "title", body.getOrDefault("title", ""));
    }
}
