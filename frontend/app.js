console.log("PrismaLife Web Inicializado! 💎");

// --- COMUNICAÇÃO COM O JAVA (API) ---
const API_URL = 'http://localhost:8080/api/tasks';
const API_SILOS_URL = 'http://localhost:8080/api/silos';

const btnAddTask = document.getElementById('btn-add-task');
const inputTask = document.getElementById('new-task-input');
const taskList = document.getElementById('task-list');
const taskPanel = document.getElementById('task-panel');
const btnCancel = document.getElementById('btn-cancel');


// --- FUNÇÃO AUXILIAR DE DATA ---
// Colocada no escopo global para que todas as funções a vejam
function formatData(dataString) {
    if (!dataString || dataString === "0") return "Nenhuma data definida";
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
}

// --- LÓGICA DE CRIAÇÃO DE NOVO SILO ---
const btnAddSilo = document.getElementById('btn-add-silo');
const newSiloForm = document.getElementById('new-silo-form');
const btnSaveSilo = document.getElementById('btn-save-silo');
const btnCancelSilo = document.getElementById('btn-cancel-silo');
const inputSiloName = document.getElementById('new-silo-input');
const silosContainer = document.getElementById('silos-container');
const taskSiloSelect = document.getElementById('task-silo');

btnAddSilo.addEventListener('click', (e) => {
    e.preventDefault();
    newSiloForm.classList.add('show');
    inputSiloName.focus();
});

btnCancelSilo.addEventListener('click', (e) => {
    e.preventDefault();
    newSiloForm.classList.remove('show');
    inputSiloName.value = "";
});

btnSaveSilo.addEventListener('click', async (e) => {
    e.preventDefault();
    const siloText = inputSiloName.value.trim();
    const siloColor = document.getElementById('new-silo-color').value;

    if (siloText !== "") {
        const siloId = siloText.toLowerCase().replace(/[\u1000-\uFFFF]+/g, '').trim().replace(/\s+/g, '-');
        const novoSilo = { name: siloText, siloTitle: siloId, color: siloColor };

        try {
            await fetch(API_SILOS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoSilo)
            });
            newSiloForm.classList.remove('show');
            inputSiloName.value = "";
            loadSilos();
        } catch (error) { console.error("Erro ao salvar Silo:", error); }
    }
});

// --- PAINEL DE TAREFAS ---
taskPanel.addEventListener('click', (e) => {
    if (!taskPanel.classList.contains('expanded')) {
        taskPanel.classList.add('expanded');
        inputTask.focus();
    }
});

btnCancel.addEventListener('click', (e) => {
    e.stopPropagation();
    taskPanel.classList.remove('expanded');
    inputTask.value = "";
});

let activeFilter = 'all';

// --- SIDEBAR ---
const sidebarMenu = document.querySelector('.sidebar-menu');
sidebarMenu.addEventListener('click', (e) => {
    const filterBtn = e.target.closest('.filter-btn');
    if (filterBtn) {
        e.preventDefault();
        document.querySelectorAll('.filter-btn').forEach(f => f.classList.remove('active'));
        filterBtn.classList.add('active');
        activeFilter = filterBtn.getAttribute('data-silo');
        loadTasks();
    }
});

async function loadSilos() {
    try {
        const response = await fetch(API_SILOS_URL);
        const silos = await response.json();
        silosContainer.innerHTML = '';
        taskSiloSelect.innerHTML = '<option value="">Sem Silo (Geral)</option>';

        silos.forEach(silo => {
            const style = document.createElement('style');
            style.innerHTML = `.task-item.${silo.siloTitle} { border-left: 5px solid ${silo.color} !important; }`;
            document.head.appendChild(style);

            const novoLink = document.createElement('a');
            novoLink.href = "#";
            novoLink.className = "filter-btn";
            novoLink.setAttribute("data-silo", silo.siloTitle);
            novoLink.innerHTML = `<span style="color: ${silo.color}">●</span> ${silo.name}`;
            silosContainer.appendChild(novoLink);

            const novaOption = document.createElement('option');
            novaOption.value = silo.siloTitle;
            novaOption.textContent = silo.name;
            taskSiloSelect.appendChild(novaOption);
        });
    } catch (error) { console.error("Erro ao carregar Silos:", error); }
}

async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        let tasks = await response.json();

        if (activeFilter !== 'all') tasks = tasks.filter(t => t.silo === activeFilter);
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.add('task-item');
            if (task.silo) li.classList.add(task.silo);

            let energyHTML = '';
            if (task.energy === 'low') energyHTML = '<span class="energy-badge energy-low">⚡ Baixa</span>';
            else if (task.energy === 'medium') energyHTML = '<span class="energy-badge energy-medium">⚡⚡ Média</span>';
            else if (task.energy === 'high') energyHTML = '<span class="energy-badge energy-high">⚡⚡⚡ Alta</span>';

            const siloTagHTML = activeFilter === 'all' ? `<span class="silo-tag">${task.silo || 'Geral'}</span>` : '';

            li.innerHTML = `
                <div class="task-header">
                    <input type="checkbox" class="checkbox-done" ${task.done ? 'checked' : ''}>
                    <div style="flex-grow: 1; display: flex; align-items: center;">
                        <label style="${task.done ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${task.content}</label>
                        ${siloTagHTML} ${energyHTML}
                    </div>
                    <div class="task-actions">
                        <button class="action-btn btn-desc" title="Descrição">📝</button>
                        <button class="action-btn btn-details" title="Detalhes">📅</button>
                        <button class="action-btn btn-subtasks" title="Subtarefas">📋</button>
                        <button class="action-btn btn-delete" title="Deletar">🗑️</button>
                    </div>
                </div>
                <div class="task-expanded-content">
                    <div class="desc-panel" style="display: none;">
                        <p><strong>📝 Notas da Missão:</strong></p>
                        <textarea class="edit-description" placeholder="Clique para adicionar detalhes...">${task.description || ''}</textarea>
                        <div class="desc-status">Salvo automaticamente</div>
                    </div>
                    <div class="details-panel" style="display: none;">
                        <p><strong>📅 Prazo/Data:</strong> ${formatData(task.date)}</p>
                        <p><strong>🔗 Referência:</strong> 
                            ${task.link
                ? `<a href="${task.link}" target="_blank" style="color: #3b82f6; text-decoration: underline;">Abrir Link Externo</a>`
                : 'Sem link cadastrado.'}
                        </p>
                    </div>
                    <div class="subtasks-panel" style="display: none;">
                        <strong>Passos da Tarefa:</strong>
                        <div class="add-subtask-inline">
                            <input type="text" class="new-subtask-text" placeholder="Adicionar próximo passo...">
                            <button class="btn-add-sub-inline">➕</button>
                        </div>
                        <ul class="subtask-list-container">
                            ${task.subTasks && task.subTasks.length > 0
                ? task.subTasks.map((st, index) => `
                                    <li class="subtask-item">
                                        <input type="checkbox" class="sub-check" data-index="${index}" ${st.done ? 'checked' : ''}>
                                        <label style="${st.done ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${st.title}</label>
                                    </li>
                                `).join('')
                : '<li style="color: #94a3b8; font-style: italic;">Nenhum passo definido.</li>'}
                        </ul>
                    </div>
                </div>
            `;

            const expandedContent = li.querySelector('.task-expanded-content');
            const descPanel = li.querySelector('.desc-panel');
            const detailsPanel = li.querySelector('.details-panel');
            const subtasksPanel = li.querySelector('.subtasks-panel');

            const togglePanel = (panelToShow) => {
                const panels = [descPanel, detailsPanel, subtasksPanel];
                let isAlreadyOpen = panelToShow.style.display === 'block';
                panels.forEach(p => p.style.display = 'none');
                if (!isAlreadyOpen) {
                    panelToShow.style.display = 'block';
                    expandedContent.classList.add('show');
                } else {
                    expandedContent.classList.remove('show');
                }
            };

            li.querySelector('.btn-desc').addEventListener('click', () => togglePanel(descPanel));
            li.querySelector('.btn-details').addEventListener('click', () => togglePanel(detailsPanel));
            li.querySelector('.btn-subtasks').addEventListener('click', () => togglePanel(subtasksPanel));

            // --- AUTO-SAVE DESCRIÇÃO ---
            const descInput = li.querySelector('.edit-description');
            descInput.addEventListener('blur', async () => {
                if (descInput.value !== (task.description || '')) {
                    try {
                        const updatedTask = { ...task, description: descInput.value };
                        await fetch(`${API_URL}/${task.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updatedTask)
                        });
                        task.description = descInput.value;
                        const status = li.querySelector('.desc-status');
                        status.textContent = "✅ Salvo!";
                        status.style.opacity = "1";
                        setTimeout(() => { status.style.opacity = "0"; }, 2000);
                    } catch (error) { console.error("Erro no auto-save:", error); }
                }
            });

            // --- LÓGICA DE SUBTAREFAS NO CARD ---
            const btnAddSubInline = li.querySelector('.btn-add-sub-inline');
            const inputSubInline = li.querySelector('.new-subtask-text');

            const saveSubtask = async () => {
                const title = inputSubInline.value.trim();
                if (title !== "") {
                    if (!task.subTasks) task.subTasks = [];
                    task.subTasks.push({ title: title, done: false });
                    try {
                        await fetch(`${API_URL}/${task.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(task)
                        });
                        inputSubInline.value = "";
                        renderSubtasksLocally();
                    } catch (error) { console.error("Erro ao adicionar subtarefa:", error); }
                }
            };

            const renderSubtasksLocally = () => {
                const container = li.querySelector('.subtask-list-container');
                container.innerHTML = task.subTasks.map((st, index) => `
                    <li class="subtask-item">
                        <input type="checkbox" class="sub-check" data-index="${index}" ${st.done ? 'checked' : ''}>
                        <label style="${st.done ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${st.title}</label>
                    </li>
                `).join('');
                rebindSubtaskChecks();
            };

            const rebindSubtaskChecks = () => {
                li.querySelectorAll('.sub-check').forEach(check => {
                    check.addEventListener('change', async (e) => {
                        const index = e.target.getAttribute('data-index');
                        task.subTasks[index].done = e.target.checked;
                        const label = e.target.nextElementSibling;
                        label.style.textDecoration = e.target.checked ? 'line-through' : 'none';
                        label.style.opacity = e.target.checked ? '0.6' : '1';

                        await fetch(`${API_URL}/${task.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(task)
                        });
                    });
                });
            };

            inputSubInline.addEventListener('keypress', (e) => { if (e.key === 'Enter') saveSubtask(); });
            btnAddSubInline.addEventListener('click', saveSubtask);
            rebindSubtaskChecks();

            // --- OUTRAS AÇÕES ---
            li.querySelector('.checkbox-done').addEventListener('change', async (e) => {
                const updatedTask = { ...task, done: e.target.checked };
                await fetch(`${API_URL}/${task.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedTask)
                });
                loadTasks();
            });

            li.querySelector('.btn-delete').addEventListener('click', async () => {
                await fetch(`${API_URL}/${task.id}`, { method: 'DELETE' });
                loadTasks();
            });

            taskList.appendChild(li);
        });
    } catch (error) { console.error("Erro ao carregar tarefas:", error); }
}

// SALVAR NOVA TAREFA
btnAddTask.addEventListener('click', async (e) => {
    e.stopPropagation();
    const taskText = inputTask.value;

    if(taskText.trim() !== "")  {
        const inputLink = document.getElementById('task-link');
        const taskLinkValue = inputLink ? inputLink.value.trim() : "";

        const newTask = {
            id: Math.floor(Math.random() * 10000),
            content: taskText,
            description: "",
            done: false,
            silo: document.getElementById('task-silo').value,
            energy: document.getElementById('task-energy').value,
            link: taskLinkValue,
            date: document.getElementById('task-date').value
        };

        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            });
            inputTask.value = "";
            document.getElementById('task-link').value = "";
            document.getElementById('task-date').value = "";

            taskPanel.classList.remove('expanded');
            loadTasks();
        } catch (error) { console.error("Erro ao salvar:", error); }

        if (inputLink) inputLink.value = "";
    }
});

loadTasks();
loadSilos();