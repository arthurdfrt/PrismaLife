public class Task {
    private int id;
    private String taskContent;
    private boolean isDone;
    private int date;
    private String cost;

    //////////////////////////////////////
    
    public Task(int id, String taskTitle, int date, String cost) {
        this.id = id;
        this.taskContent = taskTitle;
        this.isDone = false;
        this.date = date;
        this.cost = cost;
    }

    /////////////////////////////////////
    
    public void markAsDone(){
        this.isDone = true;
    }
    public void postPone(int newDate){
        this.date = newDate;
    }
    public int getId(){
        return id;
    }
    public String getContent(){
        return taskContent;
    }
}