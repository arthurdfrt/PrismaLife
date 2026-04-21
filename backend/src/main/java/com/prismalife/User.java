package com.prismalife;

import java.util.ArrayList;
import java.util.List;

public class User {
    private int id;
    private String name;
    private String email;
    public String password;
    private List<LifeArea> silos;

    private static int MAX_SILOS = 6;

    //////////////////////////////////////

    public User(int id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.silos = new ArrayList<>(0);
        this.silos.add(new LifeArea("Geral"));
    }

    //////////////////////////////////////

    public boolean createSilo(String lifeAreaName) {
        if (this.silos.size() >= MAX_SILOS) {
            System.out.println("Número máximo de áreas atingido");
            return false;
        }

        this.silos.add(new LifeArea(lifeAreaName));
        System.out.println("Área criada");
        return true;
    }

    public List<LifeArea> getSilos() {
        return silos;
    }
    public String getName() {
        return name;
    }
    public String getEmail() {
        return email;
    }
    public LifeArea getSiloByName(String siloName){
        for (LifeArea silo : this.silos) {
            if (silo.getName().equalsIgnoreCase(siloName)) {
                return silo;
            }
        }
        return null;
    }
}