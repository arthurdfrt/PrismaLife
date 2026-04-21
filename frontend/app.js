console.log("PrismaLife Web Inicializado! 💎");

const btnAddTask = document.getElementById('btn-add-task');
const inputTask = document.getElementById('new-task-input');
const taskList = document.getElementById('task-list');
const taskPanel = document.getElementById('task-panel');
const btnCancel = document.getElementById('btn-cancel');

// 1. Abrir ao clicar em qualquer lugar da barra "Nova Tarefa"
taskPanel.addEventListener('click', (e) => {
    // Só expande se já não estiver expandido
    if (!taskPanel.classList.contains('expanded')) {
        taskPanel.classList.add('expanded');
        document.getElementById('new-task-input').focus();
    }
});

// 2. Fechar ao clicar em Cancelar (evitando que o clique suba para o painel)
btnCancel.addEventListener('click', (e) => {
    e.stopPropagation(); // Impede o clique de "reabrir" o painel imediatamente
    taskPanel.classList.remove('expanded');
    document.getElementById('new-task-input').value = "";
});


const API_URL = 'http://localhost:8080/api/tasks';

async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();

        taskList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');

            li.innerHTML = `
                <input type="checkbox" class="checkbox-done" ${task.done ? 'checked' : ''}>
                <label style="${task.done ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${task.content}</label>
                <button class="btn-delete">🗑️</button>
            `;

            const checkbox = li.querySelector('.checkbox-done');
            const btnDelete = li.querySelector('.btn-delete');

            checkbox.addEventListener('change', async (event) => {
                try {
                    const updatedTask = {
                        id: task.id,
                        content: task.content,
                        done: event.target.checked
                    };
                    await fetch(`${API_URL}/${task.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedTask)
                    });

                    loadTasks();

                } catch (error) {
                    console.error("Erro ao atualizar tarefa:", error);
                }
            });

            btnDelete.addEventListener('click', async () => {
                try {
                    await fetch(`${API_URL}/${task.id}`, {
                        method: 'DELETE'
                    });

                    loadTasks();

                } catch (error) {
                    console.error("Erro ao deletar tarefa:", error);
                }
            });

            taskList.appendChild(li);
        });

    } catch (error) {
        console.error("Erro ao conectar com o servidor do PrismaLife:", error);
        alert("O servidor Java está desligado? 🤔");
    }
}

loadTasks();

btnAddTask.addEventListener('click', async () => {
    const taskText = inputTask.value;

    if(taskText.trim() !== "") {
        const newTask = {
            id: Math.floor(Math.random() * 10000),
            content: taskText,
            done: false
        };

        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            });

            inputTask.value = "";

            loadTasks();
            taskPanel.classList.remove('expanded');

        } catch (error) {
            console.error("Erro ao salvar tarefa:", error);
        }

    } else {
        alert("Por favor, digite uma tarefa!");
    }
});