import java.util.ArrayList;
import java.util.List;

public class TodoList {
    private List<Task> tasks;

    //////////////////////////////////////

    public TodoList(){
        this.tasks = new ArrayList<>();
    }

    //////////////////////////////////////

    public void createTask(Task newTask){
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