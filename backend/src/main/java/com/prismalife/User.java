package com.prismalife;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class User {

    private static final int XP_PER_LEVEL = 100;

    private long id;
    private String firstName;
    private String lastName;
    private String email;
    private String passwordHash;

    private int totalXP = 0;
    private int level   = 1;

    private final List<Silo> silos = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;

    // --- Construtores ---

    public User() {}

    public User(String firstName, String lastName, String email, String passwordHash) {
        this.firstName    = firstName;
        this.lastName     = lastName;
        this.email        = email.toLowerCase().trim();
        this.passwordHash = passwordHash;
        this.createdAt    = LocalDateTime.now();
    }

    // --- Lógica de XP e Nível ---

    public void addXp(int amount) {
        if (amount == 0) return;
        totalXP += amount;
        if (totalXP < 0) totalXP = 0;
        level = (totalXP / XP_PER_LEVEL) + 1;
    }

    public int getXpToNextLevel() {
        return (level * XP_PER_LEVEL) - totalXP;
    }

    // --- Gerenciamento de Silos ---

    public void addSilo(Silo silo) {
        silos.add(silo);
    }

    public boolean removeSilo(long siloId) {
        return silos.removeIf(s -> s.getId() == siloId);
    }

    // --- Utilitários ---

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public void recordLogin() {
        this.lastLoginAt = LocalDateTime.now();
    }

    // --- Getters ---

    public long getId()                     { return id; }
    public String getFirstName()            { return firstName; }
    public String getLastName()             { return lastName; }
    public String getEmail()                { return email; }
    public String getPasswordHash()         { return passwordHash; }
    public int getTotalXP()                 { return totalXP; }
    public int getLevel()                   { return level; }
    public List<Silo> getSilos()            { return silos; }
    public LocalDateTime getCreatedAt()     { return createdAt; }
    public LocalDateTime getLastLoginAt()   { return lastLoginAt; }

    // --- Setters ---

    public void setId(long id)                          { this.id = id; }
    public void setFirstName(String firstName)          { this.firstName = firstName; }
    public void setLastName(String lastName)            { this.lastName = lastName; }
    public void setEmail(String email)                  { this.email = email; }
    public void setPasswordHash(String passwordHash)    { this.passwordHash = passwordHash; }
    public void setTotalXP(int totalXP)                 { this.totalXP = totalXP; }
    public void setLevel(int level)                     { this.level = level; }
    public void setCreatedAt(LocalDateTime createdAt)   { this.createdAt = createdAt; }
    public void setLastLoginAt(LocalDateTime t)         { this.lastLoginAt = t; }
}