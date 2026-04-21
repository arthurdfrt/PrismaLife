package com.prismalife;

import java.util.List;
import java.util.ArrayList;

public class Task {
    private int id;
    private String taskContent;
    private boolean done;
    private int date;
    private String cost;
    private List<SubTask> subTasks;

    //////////////////////////////////////

    public Task() {
    }

    public Task(int id, String taskTitle, int date, String cost) {
        this.id = id;
        this.taskContent = taskTitle;
        this.done = false;
        this.date = date;
        this.cost = cost;
        this.subTasks = new ArrayList<>();
    }

    public Task(int id, String content){
        this.id = id;
        this.taskContent = content;
        this.done = false;
        this.subTasks = new ArrayList<>();
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

    public String getCost() {
        return cost;
    }

    public List<SubTask> getSubTasks() {
        return subTasks;
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

    public void setCost(String cost) {
        this.cost = cost;
    }

    public void setSubTasks(List<SubTask> subTasks) {
        this.subTasks = subTasks;
    }
}