package com.lawvoice.repository;

import com.lawvoice.model.UserAccount;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Repository;

@Repository
public class UserAccountRepository {
    private final AtomicLong ids = new AtomicLong(1);
    private final Map<String, UserAccount> byEmail = new ConcurrentHashMap<>();

    public UserAccount save(UserAccount account) {
        if (account.getId() == null) {
            account.setId(ids.getAndIncrement());
        }
        byEmail.put(normalize(account.getEmail()), account);
        return account;
    }

    public Optional<UserAccount> findByEmail(String email) {
        return Optional.ofNullable(byEmail.get(normalize(email)));
    }

    public boolean existsByEmail(String email) {
        return byEmail.containsKey(normalize(email));
    }

    public Optional<UserAccount> findById(Long id) {
        if (id == null) return Optional.empty();
        return byEmail.values().stream().filter(u -> id.equals(u.getId())).findFirst();
    }

    private String normalize(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
