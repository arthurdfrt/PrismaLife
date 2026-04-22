package com.prismalife;

public class SubTask {
    private String title;
    private boolean done;

    public SubTask() {}
    public SubTask(String title) {
        this.title = title;
        this.done = false;
    }

    // ------ Getters e Setters ------//


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }
}