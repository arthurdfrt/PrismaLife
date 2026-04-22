package com.prismalife;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity; // <-- Importante para o ResponseEntity
import java.util.ArrayList;
import java.util.List;
import java.util.Map;       // <-- Importante para o Map
import java.util.HashMap;   // <-- Importante para o HashMap

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private List<Task> tasks = new ArrayList<>();

    private int totalXP = 0;
    private Map<String, Integer> siloXP = new HashMap<>();

    public TaskController() {
    }

    @GetMapping
    public List<Task> getTasks() {
        return tasks;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalXP", totalXP);
        stats.put("siloXP", siloXP);
        return ResponseEntity.ok(stats);
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
    public ResponseEntity<?> updateTask(@PathVariable int id, @RequestBody Task updatedTask) {
        for (Task task : tasks) {
            if (task.getId() == id) {
                boolean justCompleted = !task.isDone() && updatedTask.isDone();

                task.setContent(updatedTask.getContent());
                task.setDone(updatedTask.isDone());
                task.setDescription(updatedTask.getDescription());
                task.setSubTasks(updatedTask.getSubTasks());
                task.setDate(updatedTask.getDate());
                task.setLink(updatedTask.getLink());
                task.setUrgent(updatedTask.isUrgent());
                task.setImportant(updatedTask.isImportant());
                task.setSomeday(updatedTask.isSomeday());
                task.setDependencies(updatedTask.getDependencies());

                Map<String, Object> response = new HashMap<>();
                response.put("task", task);

                if (justCompleted) {
                    int xp = task.claimXp();
                    String siloTitle = task.getSilo();

                    totalXP += xp;
                    if (siloTitle != null && !siloTitle.trim().isEmpty()) {
                        siloXP.put(siloTitle, siloXP.getOrDefault(siloTitle, 0) + xp);
                    }
                    response.put("xpGained", xp);
                    response.put("siloAffected", task.getSilo());
                } else {
                    response.put("xpGained", 0);
                    response.put("siloAffected", null);
                }

                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.notFound().build();
    }
}