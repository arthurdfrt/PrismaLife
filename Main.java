public class Main {

    public static void main(String[] args){

        UserRegistry registry = new UserRegistry();
        User u1 = new User(1, "arthur", "arthur@email.com");
        registry.registerUser(u1);

        User loggedUser = registry.findByEmail("arthur@email.com");

        TodoList mylist = new TodoList();

        if (loggedUser != null) {

            loggedUser.getMyTasks().createTask(new Task(1, "Jantar", 25, "medium"));
            loggedUser.getMyTasks().createTask(new Task(2, "Finalizar a TodoList", 26, "High"));
            loggedUser.getMyTasks().createTask(new Task(3, "Beber água de coco", 25, "Low"));

            loggedUser.getMyTasks().showTasks();
        }
    }
}