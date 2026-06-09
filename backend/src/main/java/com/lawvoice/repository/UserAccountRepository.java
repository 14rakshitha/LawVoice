package com.lawvoice.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawvoice.model.UserAccount;
import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Repository;

@Repository
public class UserAccountRepository {
    private static final String DATA_FILE = System.getenv("LAWVOICE_DB_PATH") != null 
            ? System.getenv("LAWVOICE_DB_PATH") 
            : "lawvoice_users.json";

    private final AtomicLong ids = new AtomicLong(1);
    private final Map<String, UserAccount> byName = new ConcurrentHashMap<>();
    private final Map<String, UserAccount> byPhone = new ConcurrentHashMap<>();
    private final ObjectMapper mapper = new ObjectMapper();

    @PostConstruct
    public void loadData() {
        File file = new File(DATA_FILE);
        if (file.exists()) {
            try {
                Map<String, UserAccount> loaded = mapper.readValue(file, new TypeReference<Map<String, UserAccount>>() {});
                for (UserAccount account : loaded.values()) {
                    byName.put(normalize(account.getName()), account);
                    if (account.getPhone() != null && !account.getPhone().isBlank()) {
                        byPhone.put(normalizePhone(account.getPhone()), account);
                    }
                    if (account.getId() != null && account.getId() >= ids.get()) {
                        ids.set(account.getId() + 1);
                    }
                }
                System.out.println("Loaded " + byName.size() + " accounts from " + DATA_FILE);
            } catch (IOException e) {
                System.err.println("Failed to load user accounts from file: " + e.getMessage());
            }
        }
    }

    private synchronized void saveData() {
        try {
            mapper.writeValue(new File(DATA_FILE), byName);
        } catch (IOException e) {
            System.err.println("Failed to save user accounts to file: " + e.getMessage());
        }
    }

    public UserAccount save(UserAccount account) {
        if (account.getId() == null) {
            account.setId(ids.getAndIncrement());
        }
        byName.put(normalize(account.getName()), account);
        if (account.getPhone() != null && !account.getPhone().isBlank()) {
            byPhone.put(normalizePhone(account.getPhone()), account);
        }
        saveData();
        return account;
    }

    public Optional<UserAccount> findByName(String name) {
        return Optional.ofNullable(byName.get(normalize(name)));
    }

    public boolean existsByName(String name) {
        return byName.containsKey(normalize(name));
    }

    public Optional<UserAccount> findByPhone(String phone) {
        return Optional.ofNullable(byPhone.get(normalizePhone(phone)));
    }

    public boolean existsByPhone(String phone) {
        return byPhone.containsKey(normalizePhone(phone));
    }

    public Optional<UserAccount> findById(Long id) {
        if (id == null) return Optional.empty();
        return byName.values().stream().filter(u -> id.equals(u.getId())).findFirst();
    }

    public java.util.Collection<UserAccount> findAll() {
        return byName.values();
    }

    private String normalize(String name) {
        return name == null ? "" : name.trim().toLowerCase();
    }

    /** Strip spaces, dashes, +91 prefix for consistent phone lookup */
    private String normalizePhone(String phone) {
        if (phone == null) return "";
        String digits = phone.replaceAll("[^0-9]", "");
        // If the number starts with 91 and has 12 digits, strip country code
        if (digits.length() == 12 && digits.startsWith("91")) {
            digits = digits.substring(2);
        }
        return digits;
    }
}

