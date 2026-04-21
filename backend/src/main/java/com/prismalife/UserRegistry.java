package com.prismalife;

import java.util.ArrayList;
import java.util.List;

public class UserRegistry {
    private List<User> users;

    //////////////////////////////////////

    public UserRegistry() {
        this.users = new ArrayList<>();
    }
    public void registerUser(User user) {
        users.add(user);
        System.out.println("Cadastrado com sucesso");
    }

    //////////////////////////////////////

    public User findByEmail(String email) {
        for (User u : users) {
            if (u.getEmail().equalsIgnoreCase(email)) {
                return u;
            }
        }
        return null;
    }
}