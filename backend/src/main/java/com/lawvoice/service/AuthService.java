package com.lawvoice.service;

import com.lawvoice.dto.AuthLoginRequest;
import com.lawvoice.dto.AuthRegisterRequest;
import com.lawvoice.dto.AuthResponse;
import com.lawvoice.dto.AuthUserDto;
import com.lawvoice.model.UserAccount;
import com.lawvoice.repository.UserAccountRepository;
import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserAccountRepository users;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final Map<String, Long> sessions = new ConcurrentHashMap<>();

    public AuthService(UserAccountRepository users) {
        this.users = users;
    }

    @PostConstruct
    void seedDemoUsers() {
        registerIfMissing("people", "டெமோ பயனர்", "people@lawvoice.com", "people123", "+91 98765 43210", "சென்னை", null);
        Map<String, Object> lawyerProfile = new HashMap<>();
        lawyerProfile.put("barId", "TN/2145/2016");
        lawyerProfile.put("category", "குற்றவியல் சட்டம்");
        lawyerProfile.put("city", "சென்னை");
        lawyerProfile.put("experience", "9 ஆண்டுகள்");
        registerIfMissing("lawyer", "Adv. ப்ரியா ராமன்", "lawyer@lawvoice.com", "lawyer123", "+91 90000 10001", "சென்னை", lawyerProfile);
    }

    public AuthResponse register(AuthRegisterRequest request) {
        String role = normalizeRole(request.role());
        if (users.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது.");
        }
        UserAccount account = new UserAccount();
        account.setRole(role);
        account.setName(request.name().trim());
        account.setEmail(request.email().trim().toLowerCase());
        account.setPasswordHash(encoder.encode(request.password()));
        account.setPhone(request.phone().trim());
        account.setDistrict(request.district().trim());
        if ("lawyer".equals(role)) {
            account.setLawyerProfile(request.lawyerProfile() == null ? Map.of() : request.lawyerProfile());
        }
        users.save(account);
        return buildResponse(account, "பதிவு வெற்றிகரமாக முடிந்தது.");
    }

    public AuthResponse login(AuthLoginRequest request) {
        String role = normalizeRole(request.role());
        UserAccount account = users.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "மின்னஞ்சல் அல்லது கடவுச்சொல் தவறானது."));
        if (!role.equals(account.getRole())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "இந்த கணக்கு தேர்ந்தெடுத்த பாத்திரத்திற்கு பொருந்தாது.");
        }
        if (!encoder.matches(request.password(), account.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "மின்னஞ்சல் அல்லது கடவுச்சொல் தவறானது.");
        }
        return buildResponse(account, "வெற்றிகரமாக உள்நுழைந்தீர்கள்.");
    }

    public AuthUserDto me(String token) {
        Long userId = sessions.get(token);
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "அமர்வு காலாவதியானது. மீண்டும் உள்நுழையவும்.");
        }
        return users.findById(userId)
                .map(this::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "பயனர் கிடைக்கவில்லை."));
    }

    private AuthResponse buildResponse(UserAccount account, String message) {
        String token = UUID.randomUUID().toString();
        sessions.put(token, account.getId());
        return new AuthResponse(token, message, toDto(account));
    }

    private AuthUserDto toDto(UserAccount account) {
        return new AuthUserDto(
                account.getId(),
                account.getRole(),
                account.getName(),
                account.getEmail(),
                account.getPhone(),
                account.getDistrict(),
                account.getLawyerProfile()
        );
    }

    private void registerIfMissing(String role, String name, String email, String password, String phone, String district, Map<String, Object> lawyerProfile) {
        if (users.existsByEmail(email)) return;
        UserAccount account = new UserAccount();
        account.setRole(role);
        account.setName(name);
        account.setEmail(email);
        account.setPasswordHash(encoder.encode(password));
        account.setPhone(phone);
        account.setDistrict(district);
        account.setLawyerProfile(lawyerProfile);
        users.save(account);
    }

    private String normalizeRole(String role) {
        return role == null ? "people" : role.trim().toLowerCase();
    }
}
