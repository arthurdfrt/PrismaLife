package com.prismalife;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final List<User> users = new ArrayList<>();
    private long nextId = 1;

    // -------------------------------------------------------
    // POST /api/users/register
    // Cria um novo usuário. Rejeita e-mails duplicados.
    // -------------------------------------------------------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User newUser) {
        // Validações básicas
        if (newUser.getEmail() == null || newUser.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(error("E-mail é obrigatório."));
        }
        if (newUser.getPasswordHash() == null || newUser.getPasswordHash().isBlank()) {
            return ResponseEntity.badRequest().body(error("Senha é obrigatória."));
        }

        // Verifica e-mail duplicado
        boolean emailTaken = users.stream()
                .anyMatch(u -> u.getEmail().equalsIgnoreCase(newUser.getEmail().trim()));
        if (emailTaken) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(error("Já existe uma conta com este e-mail."));
        }

        newUser.setId(nextId++);
        newUser.setEmail(newUser.getEmail().toLowerCase().trim());
        users.add(newUser);

        System.out.println("Novo usuário registrado: " + newUser.getFullName());
        return ResponseEntity.status(HttpStatus.CREATED).body(sanitized(newUser));
    }

    // -------------------------------------------------------
    // POST /api/users/login
    // Autentica o usuário por e-mail + passwordHash.
    // Body esperado: { "email": "...", "passwordHash": "..." }
    // -------------------------------------------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email    = credentials.getOrDefault("email", "").trim().toLowerCase();
        String passHash = credentials.getOrDefault("passwordHash", "");

        Optional<User> found = users.stream()
                .filter(u -> u.getEmail().equals(email) && u.getPasswordHash().equals(passHash))
                .findFirst();

        if (found.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(error("E-mail ou senha incorretos."));
        }

        User user = found.get();
        user.recordLogin();

        System.out.println("Login: " + user.getFullName() + " | " + user.getLastLoginAt());
        return ResponseEntity.ok(sanitized(user));
    }

    // -------------------------------------------------------
    // GET /api/users/{id}
    // Retorna os dados públicos de um usuário.
    // -------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable long id) {
        return users.stream()
                .filter(u -> u.getId() == id)
                .findFirst()
                .map(u -> ResponseEntity.ok(sanitized(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------
    // GET /api/users/{id}/stats
    // Retorna XP, nível e progresso para o próximo nível.
    // Usado pela sidebar para atualizar o contador de XP.
    // -------------------------------------------------------
    @GetMapping("/{id}/stats")
    public ResponseEntity<?> getStats(@PathVariable long id) {
        return users.stream()
                .filter(u -> u.getId() == id)
                .findFirst()
                .map(u -> {
                    Map<String, Object> stats = new HashMap<>();
                    stats.put("totalXP",        u.getTotalXP());
                    stats.put("level",           u.getLevel());
                    stats.put("xpToNextLevel",   u.getXpToNextLevel());
                    return ResponseEntity.ok(stats);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------
    // PUT /api/users/{id}/xp
    // Chamado pelo TaskController quando uma tarefa é concluída.
    // Body esperado: { "amount": 25, "siloName": "📚 Estudos" }
    // -------------------------------------------------------
    @PutMapping("/{id}/xp")
    public ResponseEntity<?> updateXp(@PathVariable long id,
                                      @RequestBody Map<String, Object> body) {
        int amount = (int) body.getOrDefault("amount", 0);

        return users.stream()
                .filter(u -> u.getId() == id)
                .findFirst()
                .map(u -> {
                    u.addXp(amount);

                    Map<String, Object> response = new HashMap<>();
                    response.put("totalXP",      u.getTotalXP());
                    response.put("level",         u.getLevel());
                    response.put("xpToNextLevel", u.getXpToNextLevel());
                    response.put("xpChanged",     amount);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------
    // PUT /api/users/{id}
    // Atualiza nome e/ou e-mail do usuário.
    // -------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable long id, @RequestBody User updated) {
        return users.stream()
                .filter(u -> u.getId() == id)
                .findFirst()
                .map(u -> {
                    if (updated.getFirstName() != null) u.setFirstName(updated.getFirstName());
                    if (updated.getLastName()  != null) u.setLastName(updated.getLastName());
                    return ResponseEntity.ok(sanitized(u));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------
    // DELETE /api/users/{id}
    // Remove o usuário da lista.
    // -------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable long id) {
        boolean removed = users.removeIf(u -> u.getId() == id);
        return removed
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    // -------------------------------------------------------
    // Helpers privados
    // -------------------------------------------------------

    /** Retorna o usuário sem o passwordHash para o frontend. */
    private Map<String, Object> sanitized(User u) {
        Map<String, Object> map = new HashMap<>();
        map.put("id",          u.getId());
        map.put("firstName",   u.getFirstName());
        map.put("lastName",    u.getLastName());
        map.put("fullName",    u.getFullName());
        map.put("email",       u.getEmail());
        map.put("totalXP",     u.getTotalXP());
        map.put("level",       u.getLevel());
        map.put("createdAt",   u.getCreatedAt());
        map.put("lastLoginAt", u.getLastLoginAt());
        return map;
    }

    private Map<String, String> error(String message) {
        Map<String, String> map = new HashMap<>();
        map.put("error", message);
        return map;
    }
}