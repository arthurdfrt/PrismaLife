public class LifeArea {
    private String name;
    private TaskList mainTasks;
    private SomeDay ideas;
    
    /////////////////////////////////////////
    
    public LifeArea(String name){
        this.name = name;
        this.mainTasks = new TaskList();
        this.ideas = new SomeDay();
    }

    ////////////////////////////////////////
    
    public String getName(){
        return name;
    }
    public TaskList getMainTasks(){
        return mainTasks;
    }
    public SomeDay getIdeas(){
        return ideas;
    }
}
