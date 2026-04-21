console.log("PrismaLife Web Inicializado! 💎");

// --- COMUNICAÇÃO COM O JAVA (API) ---
const API_URL = 'http://localhost:8080/api/tasks';
const API_SILOS_URL = 'http://localhost:8080/api/silos';

const btnAddTask = document.getElementById('btn-add-task');
const inputTask = document.getElementById('new-task-input');
const taskList = document.getElementById('task-list');
const taskPanel = document.getElementById('task-panel');
const btnCancel = document.getElementById('btn-cancel');

// --- LÓGICA DE CRIAÇÃO DE NOVO SILO ---
const btnAddSilo = document.getElementById('btn-add-silo');
const newSiloForm = document.getElementById('new-silo-form');
const btnSaveSilo = document.getElementById('btn-save-silo');
const btnCancelSilo = document.getElementById('btn-cancel-silo');
const inputSiloName = document.getElementById('new-silo-input');
const silosContainer = document.getElementById('silos-container');
const taskSiloSelect = document.getElementById('task-silo');

// Abrir o mini-formulário
btnAddSilo.addEventListener('click', (e) => {
    e.preventDefault();
    newSiloForm.classList.add('show');
    inputSiloName.focus();
});

// Fechar o mini-formulário
btnCancelSilo.addEventListener('click', (e) => {
    e.preventDefault();
    newSiloForm.classList.remove('show');
    inputSiloName.value = "";
});

// Salvar o Silo
btnSaveSilo.addEventListener('click', async (e) => {
    e.preventDefault();
    const siloText = inputSiloName.value.trim();
    const siloColor = document.getElementById('new-silo-color').value;

    if (siloText !== "") {
        const siloId = siloText.toLowerCase().replace(/[\u1000-\uFFFF]+/g, '').trim().replace(/\s+/g, '-');

        const novoSilo = {
            name: siloText,
            siloTitle: siloId,
            color: siloColor
        };

        try {
            // Manda pro Java salvar!
            await fetch(API_SILOS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoSilo)
            });

            // Limpa e esconde o painel
            newSiloForm.classList.remove('show');
            inputSiloName.value = "";

            // Recarrega os silos da tela
            loadSilos();

        } catch (error) {
            console.error("Erro ao salvar Silo:", error);
        }
    }
});

// --- LÓGICA DO PAINEL DE TAREFAS ---

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

// --- DELEGAÇÃO DE EVENTOS DA SIDEBAR ---
const sidebarMenu = document.querySelector('.sidebar-menu');

sidebarMenu.addEventListener('click', (e) => {
    const filterBtn = e.target.closest('.filter-btn');
    if (filterBtn) {
        e.preventDefault();

        // Estética: Remove 'active' de todos
        document.querySelectorAll('.filter-btn').forEach(f => f.classList.remove('active'));
        filterBtn.classList.add('active');

        // Lógica: Filtra e recarrega
        activeFilter = filterBtn.getAttribute('data-silo');
        loadTasks();
    }
});

async function loadSilos() {
    try {
        const response = await fetch(API_SILOS_URL);
        const silos = await response.json();

        // Limpa os containers antes de recriar
        silosContainer.innerHTML = '';
        taskSiloSelect.innerHTML = '<option value="">Sem Silo (Geral)</option>';

        silos.forEach(silo => {
            // 1. Injeta o CSS dinâmico na página para a cor da tarefa
            const style = document.createElement('style');
            style.innerHTML = `.task-item.${silo.siloTitle} { border-left: 5px solid ${silo.color} !important; }`;
            document.head.appendChild(style);

            // 2. Cria o botão na Sidebar
            const novoLink = document.createElement('a');
            novoLink.href = "#";
            novoLink.className = "filter-btn";
            novoLink.setAttribute("data-silo", silo.siloTitle);
            novoLink.innerHTML = `<span style="color: ${silo.color}">●</span> ${silo.name}`;
            silosContainer.appendChild(novoLink);

            // 3. Adiciona na lista de opções (Select)
            const novaOption = document.createElement('option');
            novaOption.value = silo.siloTitle;
            novaOption.textContent = silo.name;
            taskSiloSelect.appendChild(novaOption);
        });

    } catch (error) {
        console.error("Erro ao carregar os Silos do Java:", error);
    }
}

async function loadTasks() {
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

            // Mapeando a energia corretamente
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

// Salvando nova tarefa
btnAddTask.addEventListener('click', async (e) => {
    e.stopPropagation();
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

loadTasks();
loadSilos();