console.log("PrismaLife Web Inicializado! 💎");

const btnAddTask = document.getElementById('btn-add-task');
const inputTask = document.getElementById('new-task-input');
const taskList = document.getElementById('task-list');
const taskPanel = document.getElementById('task-panel');
const btnCancel = document.getElementById('btn-cancel');

// 1. Abrir ao clicar na barra
taskPanel.addEventListener('click', (e) => {
    if (!taskPanel.classList.contains('expanded')) {
        taskPanel.classList.add('expanded');
        document.getElementById('new-task-input').focus();
    }
});

// 2. Fechar ao clicar em Cancelar
btnCancel.addEventListener('click', (e) => {
    e.stopPropagation();
    taskPanel.classList.remove('expanded');
    document.getElementById('new-task-input').value = "";
});

let activeFilter = 'all';

// Captura todos os botões de filtro da sidebar
const filter = document.querySelectorAll('.filter-btn');

filter.forEach(filterBtn => {
    filterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        filter.forEach(f => f.classList.remove('active'));
        filterBtn.classList.add('active');
        activeFilter = filterBtn.getAttribute('data-silo');
        loadTasks();
    });
});

const API_URL = 'http://localhost:8080/api/tasks';

async function loadTasks() {
    // ERRO 1 CORRIGIDO: Removi o fetch duplicado daqui de fora

    try {
        const response = await fetch(API_URL);
        let tasks = await response.json();

        // FILTRAGEM:
        if (activeFilter !== 'all') {
            tasks = tasks.filter(t => t.silo === activeFilter);
        }
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.add('task-item');
            if (task.silo) li.classList.add(task.silo);

            // Mapeando a energia corretamente (já com o seu novo nome no Java)
            let energyHTML = '';
            if (task.energy === 'low') energyHTML = '<span class="energy-badge energy-low">⚡ Baixa</span>';
            else if (task.energy === 'medium') energyHTML = '<span class="energy-badge energy-medium">⚡⚡ Média</span>';
            else if (task.energy === 'high') energyHTML = '<span class="energy-badge energy-high">⚡⚡⚡ Alta</span>';

            const siloTagHTML = activeFilter === 'all' ? `<span class="silo-tag">${task.silo || 'Geral'}</span>` : '';
            // Montando o HTML da Tarefa
            li.innerHTML = `
                <div class="task-header">
                    <input type="checkbox" class="checkbox-done" ${task.done ? 'checked' : ''}>

                    <div style="flex-grow: 1; display: flex; align-items: center;">
                        <label style="${task.done ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${task.content}</label>
                        ${siloTagHTML} ${energyHTML}
                    </div>

                    <div class="task-actions">
                        <button class="action-btn btn-details" title="Detalhes da Tarefa">📅</button>
                        <button class="action-btn btn-subtasks" title="Ver Subtarefas">📋</button>
                        <button class="action-btn btn-delete" title="Deletar">🗑️</button>
                    </div>
                </div>
            
                <div class="task-expanded-content">
                    <div class="details-panel" style="display: none;">
                        <p><strong>📅 Prazo/Data:</strong> ${task.date ? task.date : 'Nenhuma data definida'}</p>
                        <p><strong>🔗 Referência:</strong> Adicione links aqui no futuro.</p>
                    </div>
            
                    <div class="subtasks-panel" style="display: none;">
                        <strong>Passos da Missão:</strong>
                        <ul>
                            ${task.subTasks && task.subTasks.length > 0
                ? task.subTasks.map(st => `<li><input type="checkbox"> ${st.title || 'Subtarefa'}</li>`).join('')
                : '<li style="color: #94a3b8; font-style: italic;">Nenhum passo extra adicionado.</li>'}
                        </ul>
                    </div>
                </div>
            `;

            // Lógica de Expandir/Recolher
            const expandedContent = li.querySelector('.task-expanded-content');
            const detailsPanel = li.querySelector('.details-panel');
            const subtasksPanel = li.querySelector('.subtasks-panel');

            li.querySelector('.btn-details').addEventListener('click', () => {
                subtasksPanel.style.display = 'none';
                if (detailsPanel.style.display === 'none') {
                    detailsPanel.style.display = 'block';
                    expandedContent.classList.add('show');
                } else {
                    detailsPanel.style.display = 'none';
                    expandedContent.classList.remove('show');
                }
            });

            li.querySelector('.btn-subtasks').addEventListener('click', () => {
                detailsPanel.style.display = 'none';
                if (subtasksPanel.style.display === 'none') {
                    subtasksPanel.style.display = 'block';
                    expandedContent.classList.add('show');
                } else {
                    subtasksPanel.style.display = 'none';
                    expandedContent.classList.remove('show');
                }
            });

            const checkbox = li.querySelector('.checkbox-done');
            const btnDelete = li.querySelector('.btn-delete');

            // ERRO 2 CORRIGIDO: Usando o ...task para não apagar a energia/silo ao dar check!
            checkbox.addEventListener('change', async (event) => {
                try {
                    const updatedTask = { ...task, done: event.target.checked };
                    await fetch(`${API_URL}/${task.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedTask)
                    });
                    loadTasks();
                } catch (error) {
                    console.error("Erro ao atualizar tarefa:", error);
                }
            });

            btnDelete.addEventListener('click', async () => {
                try {
                    await fetch(`${API_URL}/${task.id}`, { method: 'DELETE' });
                    loadTasks();
                } catch (error) {
                    console.error("Erro ao deletar tarefa:", error);
                }
            });

            taskList.appendChild(li);
        });

    } catch (error) {
        console.error("Erro ao conectar com o servidor do PrismaLife:", error);
    }
}

loadTasks();

// ERRO 3 CORRIGIDO: Capturando Energia e Data na hora de salvar!
btnAddTask.addEventListener('click', async (e) => {
    e.stopPropagation(); // Evita que o clique feche o painel acidentalmente
    const taskText = inputTask.value;

    if(taskText.trim() !== "") {
        const selectedSilo = document.getElementById('task-silo').value;
        const selectedEnergy = document.getElementById('task-energy').value;
        const selectedDate = document.getElementById('task-date').value;

        const newTask = {
            id: Math.floor(Math.random() * 10000),
            content: taskText,
            done: false,
            silo: selectedSilo,
            energy: selectedEnergy,
            date: selectedDate ? parseInt(selectedDate.replace(/-/g, "")) : 0
        };

        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            });

            inputTask.value = "";
            taskPanel.classList.remove('expanded');
            loadTasks();

        } catch (error) {
            console.error("Erro ao salvar tarefa:", error);
        }

    } else {
        alert("Por favor, digite uma missão!");
    }
});