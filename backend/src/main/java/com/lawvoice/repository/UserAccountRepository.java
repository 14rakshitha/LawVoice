package com.lawvoice.repository;

import com.lawvoice.model.UserAccount;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.Collection;

@Repository
public class UserAccountRepository {
    private final UserAccountJpaRepository jpaRepository;

    public UserAccountRepository(UserAccountJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    public UserAccount save(UserAccount account) {
        account.setName(account.getName() == null ? "" : account.getName().trim());
        if (account.getPhone() != null) {
            account.setPhone(normalizePhone(account.getPhone()));
        }
        return jpaRepository.save(account);
    }

    public Optional<UserAccount> findByName(String name) {
        if (name == null) return Optional.empty();
        return jpaRepository.findByNameIgnoreCase(name.trim());
    }

    public boolean existsByName(String name) {
        if (name == null) return false;
        return jpaRepository.existsByNameIgnoreCase(name.trim());
    }

    public Optional<UserAccount> findByPhone(String phone) {
        if (phone == null) return Optional.empty();
        return jpaRepository.findByPhone(normalizePhone(phone));
    }

    public boolean existsByPhone(String phone) {
        if (phone == null) return false;
        return jpaRepository.existsByPhone(normalizePhone(phone));
    }

    public Optional<UserAccount> findById(Long id) {
        return jpaRepository.findById(id);
    }

    public Collection<UserAccount> findAll() {
        return jpaRepository.findAll();
    }

    private String normalizePhone(String phone) {
        if (phone == null) return "";
        String digits = phone.replaceAll("[^0-9]", "");
        if (digits.length() == 12 && digits.startsWith("91")) {
            digits = digits.substring(2);
        }
        return digits;
    }
}
