package com.prismalife;

public class UserStats {
    private static int totalXP = 0;

    public static void addXP(int amount) {
        totalXP += amount;
    }

    public static int getTotalXP() {
        return totalXP;
    }
}