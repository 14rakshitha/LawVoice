package com.lawvoice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import java.time.LocalDateTime;
import java.util.Map;
import com.lawvoice.util.JsonToMapConverter;

@Entity
@Table(name = "user_accounts")
public class UserAccount {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String role;
    
    @Column(unique = true)
    private String name;
    
    private String email;
    private String passwordHash;
    private String phone;
    private String district;
    
    @Convert(converter = JsonToMapConverter.class)
    @Column(columnDefinition = "TEXT")
    private Map<String, Object> lawyerProfile;
    
    @com.fasterxml.jackson.annotation.JsonIgnore
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public Map<String, Object> getLawyerProfile() { return lawyerProfile; }
    public void setLawyerProfile(Map<String, Object> lawyerProfile) { this.lawyerProfile = lawyerProfile; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
