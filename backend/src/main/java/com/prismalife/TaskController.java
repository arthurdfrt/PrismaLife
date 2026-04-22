package com.prismalife;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    // ESTADO DA APLICAÇÃO (BANCO DE DADOS EM MEMÓRIA)
    // Aqui armazenamos as tarefas e a pontuação do usuário temporariamente.
    private List<Task> tasks = new ArrayList<>();

    private int totalXP = 0;
    private Map<String, Integer> siloXP = new HashMap<>();

    // CONSTRUTOR PADRÃO
    public TaskController() {
    }

    // Devolve a lista completa de tarefas.
    @GetMapping
    public List<Task> getTasks() {
        return tasks;
    }

    // Devolve o Total de XP e o XP agrupado por Silos para montar o Gráfico
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalXP", totalXP);
        stats.put("siloXP", siloXP);
        return ResponseEntity.ok(stats);
    }

    // Recebe uma nova tarefa do Frontend e salva na lista.
    @PostMapping
    public Task createTask(@RequestBody Task newTask) {
        tasks.add(newTask);
        return newTask;
    }

    // Encontra uma tarefa pelo ID e a remove da lista.
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable int id) {
        tasks.removeIf(task -> task.getId() == id);
    }

    // Atualiza os dados de uma tarefa e executa a lógica de XP.
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable int id, @RequestBody Task updatedTask) {
        for (Task task : tasks) {
            if (task.getId() == id) {
                // 1. VERIFICAÇÃO DE TRANSIÇÃO DE ESTADO
                // Checa se a tarefa foi recém-marcada como feita ou desmarcada.
                boolean justCompleted = !task.isDone() && updatedTask.isDone();
                boolean justUnchecked = task.isDone() && !updatedTask.isDone();

                // 2. ATUALIZAÇÃO DOS DADOS DA TAREFA
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

                // 3. PREPARAÇÃO DA RESPOSTA HTTP
                Map<String, Object> response = new HashMap<>();
                response.put("task", task);

                // 4. CÁLCULO DA RECOMPENSA (SISTEMA DE XP)
                // Se a tarefa foi feita, ganha XP. Se foi desmarcada, perde XP.
                int xpAmount = 0;
                if (justCompleted) {
                    xpAmount = task.claimXp();
                } else if (justUnchecked) {
                    xpAmount = -task.claimXp();
                }

                // 5. ATUALIZAÇÃO E DISTRIBUIÇÃO DOS PONTOS (COM PROTEÇÃO)
                if (xpAmount != 0) {
                    String siloTitle = task.getSilo();

                    totalXP += xpAmount;
                    if (totalXP < 0) totalXP = 0;

                    if (siloTitle != null && !siloTitle.trim().isEmpty()) {
                        int currentSiloXp = siloXP.getOrDefault(siloTitle, 0);
                        int newSiloXp = currentSiloXp + xpAmount;
                        if (newSiloXp < 0) newSiloXp = 0; // Proteção do silo
                        siloXP.put(siloTitle, newSiloXp);
                    }
                    response.put("xpGained", xpAmount);
                    response.put("siloAffected", task.getSilo());
                } else {
                    response.put("xpGained", 0);
                    response.put("siloAffected", null);
                }
                // 6. RETORNO
                return ResponseEntity.ok(response);
            }
        }
        // 7. TRATAMENTO DE ERRO (CASO O ID NÃO EXISTA)
        return ResponseEntity.notFound().build();
    }
}