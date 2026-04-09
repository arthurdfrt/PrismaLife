import java.util.ArrayList;
import java.util.List;

public class TaskList {
    private List<Task> tasks;

    //////////////////////////////////////

    public TaskList(){
        this.tasks = new ArrayList<>();
    }

    //////////////////////////////////////

    public void addTask(Task newTask){
        tasks.add(newTask);
    }

    public void deleteTask(int identity){
        tasks.removeIf(t -> t.getId() == identity);
    }

    public void showTasks(){
        System.out.println("Tasks:");
        for(Task t : tasks) {
            System.out.println(t.getContent());
        }
    }
}