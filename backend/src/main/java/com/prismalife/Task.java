package com.prismalife;

import java.util.List;
import java.util.ArrayList;

public class Task {
    private int id;
    private String taskContent;
    private boolean done;
    private int date;
    private String energy;
    private List<SubTask> subTasks;
    private String silo;

    //////////////////////////////////////

    public Task() {
    }

    public Task(int id, String taskTitle, String silo, String energy) {
        this.id = id;
        this.taskContent = taskTitle;
        this.done = false;
        this.subTasks = new ArrayList<>();
        this.silo = silo;
        this.energy = energy;
    }

    /////////////////////////////////////
    
    public void markAsDone(){
        this.done = true;
    }
    public void postPone(int newDate){
        this.date = newDate;
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

    public int getDate() {
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

    public void setDate(int date) {
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
}