package com.prismalife;

import java.util.List;
import java.util.ArrayList;

public class Task {
    private int id;
    private String taskContent;
    private boolean done;
    private String date;
    private String energy;
    private List<SubTask> subTasks;
    private String silo;
    private String description;
    private String link;
    private boolean urgent;
    private boolean important;
    private boolean someday;
    private List<Long> dependencies;


    //////////////////////////////////////

    public Task() {
    }

    public Task(int id, String taskTitle, String silo, String energy, String description) {
        this.id = id;
        this.taskContent = taskTitle;
        this.done = false;
        this.subTasks = new ArrayList<>();
        this.silo = silo;
        this.energy = energy;
    }

    ////////////////// XP Logic //////////////////
    public int claimXp() {
        RewardSystem reward;
        switch (this.energy.toLowerCase()) {
            case "high":
                reward = new HighEnergyReward();
                break;
            case "medium":
                reward = new MediumEnergyReward();
                break;
            default:
                reward = new LowEnergyReward();
                break;
        }
        return reward.calculate();
    }

    ///////////////// Getters ///////////////////

    public int getId() {
        return id;
    }

    public String getContent() {
        return taskContent;
    }

    public boolean isDone() {
        return done;
    }

    public String getDate() {
        return date;
    }

    public String getEnergy() {
        return energy;
    }

    public List<SubTask> getSubTasks() {
        return subTasks;
    }

    public String getSilo() {
        return silo;
    }

    public String getDescription() {
        return description;
    }

    public String getLink() {
        return link;
    }

    public boolean isUrgent() {
        return urgent;
    }
    public boolean isImportant() {
        return important;
    }
    public boolean isSomeday() {
        return someday;
    }
    public List<Long> getDependencies() {
        return dependencies;
    }

    ///////////////// Setters ///////////////////

    public void setId(int id) {
        this.id = id;
    }

    public void setContent(String taskContent) {
        this.taskContent = taskContent;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setEnergy(String energy) {
        this.energy = energy;
    }

    public void setSubTasks(List<SubTask> subTasks) {
        this.subTasks = subTasks;
    }

    public void setSilo(String silo) {
        this.silo = silo;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    public void setLink(String link) {
        this.link = link;
    }

    public void setUrgent(boolean urgent) {
        this.urgent = urgent;
    }
    public void setImportant(boolean important) {
        this.important = important;
    }
    public void setSomeday(boolean someday) {
        this.someday = someday;
    }
    public void setDependencies(List<Long> dependencies) {
        this.dependencies = dependencies;
    }
}