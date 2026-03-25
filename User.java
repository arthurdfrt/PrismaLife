public class User {
    private int id;
    private String name;
    private String email;
    public String password;
    private TodoList myTasks;
    
    //////////////////////////////////////
    
    public User(int id, String name, String email){
        this.id = id;
        this.name = name;
        this.email = email;
        this.myTasks = new TodoList();
    }

    //////////////////////////////////////

    public TodoList getMyTasks(){
        return myTasks;
    }

    public String getEmail(){
        return email;
    }
}