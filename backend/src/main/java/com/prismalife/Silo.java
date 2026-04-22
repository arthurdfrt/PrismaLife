package com.prismalife;

public class Silo {
    private long id;
    private String name;
    private String siloTitle;
    private String color;
    private int xp = 0;

    public Silo() {

    }

    public Silo(String name, String siloTitle, String color) {
        this.name = name;
        this.siloTitle = siloTitle;
        this.color = color;
    }

    public void addXp(int amount) {
        this.xp += amount;
    }

    /// ------- Getters ------- ///
    public long getId() {
        return id;
    }
    public String getName() {
        return name;
    }

    public String getSiloTitle() {
        return siloTitle;
    }

    public String getColor() {
        return color;
    }
    public int getXp() {
        return xp;
    }

    /// ------ Setters ------ ///
    public void setId(long id) {
        this.id = id;
    }
    public void setName(String name) {
        this.name = name;
    }

    public void setSiloTitle(String siloTitle) {
        this.siloTitle = siloTitle;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public void setXp(int xp) {
        this.xp = xp;
    }
}
