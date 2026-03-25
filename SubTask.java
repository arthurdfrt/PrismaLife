public class SubTask {
    private String subTaskContent;
    private boolean isDone;

    //////////////////////////////////////

    public SubTask(String content) {
        this.subTaskContent = content;
        this.isDone = false;
    }

    //////////////////////////////////////

    public void markAsDone() {
        this.isDone = true;
    }

    public String getContent() {
        return subTaskContent;
    }
}