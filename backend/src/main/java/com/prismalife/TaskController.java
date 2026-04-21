package com.prismalife;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private List<Task> tasks = new ArrayList<>();

    public TaskController() {
        tasks.add(new Task(101, "Integrar front com back"));
        tasks.add(new Task(102, "Dominar springboot"));
    }
    @GetMapping
    public List<Task> getTasks() {
        return tasks;
    }

    @PostMapping
    public Task createTask(@RequestBody Task newTask) {
        tasks.add(newTask);
        return newTask;
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable int id) {
        tasks.removeIf(task -> task.getId() == id);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable int id, @RequestBody Task updatedTask) {
        for (Task task : tasks) {
            if (task.getId() == id) {
                task.setContent(updatedTask.getContent());
                task.setDone(updatedTask.isDone());
                return task;
            }
        }
        return null;
    }
}