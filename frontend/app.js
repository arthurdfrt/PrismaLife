console.log("PrismaLife Web Inicializado! 💎");

// --- CONFIGURAÇÃO GLOBAL ---
const API_URL       = 'http://localhost:8080/api/tasks';
const API_SILOS_URL = 'http://localhost:8080/api/silos';
const API_USERS_URL = 'http://localhost:8080/api/users';

// --- SESSÃO DO USUÁRIO ---
// Lê o ID salvo pelo login/registro. Se não existir, redireciona para o login.
const CURRENT_USER_ID = localStorage.getItem('prismalife_user_id');
const CURRENT_USER_NAME = localStorage.getItem('prismalife_user_name');

if (!CURRENT_USER_ID) {
    window.location.href = 'login.html';
}

// Exibe o nome do usuário na sidebar se houver um elemento para isso
const userGreeting = document.getElementById('user-greeting');
if (userGreeting && CURRENT_USER_NAME) {
    userGreeting.textContent = CURRENT_USER_NAME;
}

// Elementos do DOM
const btnAddTask = document.getElementById('btn-add-task');
const inputTask  = document.getElementById('new-task-input');
const taskList   = document.getElementById('task-list');
const taskPanel  = document.getElementById('task-panel');
const btnCancel  = document.getElementById('btn-cancel');

// VARIÁVEIS DE ESTADO
let totalXP         = 0;
let siloXP          = {};
let lifeChart       = null;
let activeFilter    = 'all';
let filterUrgent    = false;
let filterImportant = false;

// --- SISTEMA DE GRÁFICO (RADAR) --- (sem alterações)
function updateRadarChart() {
    const header = document.getElementById('dashboard-header');
    if (activeFilter !== 'all') {
        if (header) header.style.display = 'none';
        return;
    }
    if (header) header.style.display = 'flex';

    const canvas = document.getElementById('lifeRadarChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const labels     = Object.keys(siloXP);
    const dataValues = Object.values(siloXP);

    if (lifeChart) lifeChart.destroy();

    if (typeof Chart !== 'undefined') {
        lifeChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels.length ? labels : ['Starting...'],
                datasets: [{
                    label: 'Life Balance (XP)',
                    data: dataValues.length ? dataValues : [0],
                    backgroundColor: 'rgba(59, 130, 246, 0.25)',
                    borderColor: '#60a5fa',
                    borderWidth: 2,
                    pointBackgroundColor: '#3b82f6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: 20 },
                scales: {
                    r: {
                        angleLines: { color: '#556387' },
                        grid: { color: '#556387' },
                        pointLabels: { color: '#cbd5e1', font: { size: 14 } },
                        ticks: { display: false, stepSize: 20 },
                        suggestedMin: 0
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
}

// --- SISTEMA DE XP ---
// Atualiza a UI localmente e sincroniza o novo total com o backend do usuário.
async function addXP(amount, siloId) {
    if (amount === 0) return;

    totalXP += amount;
    if (totalXP < 0) totalXP = 0;

    if (siloId && siloId !== "") {
        if (!siloXP[siloId]) siloXP[siloId] = 0;
        siloXP[siloId] += amount;
        if (siloXP[siloId] < 0) siloXP[siloId] = 0;
    }

    const currentLevel = Math.floor(totalXP / 100) + 1;
    document.getElementById('xp-counter').textContent = totalXP;
    document.getElementById('user-level').textContent = currentLevel;

    if (amount > 0) {
        const statsCard = document.getElementById('user-stats-card');
        if (statsCard) {
            statsCard.classList.add('xp-glow');
            setTimeout(() => statsCard.classList.remove('xp-glow'), 400);
        }
        console.log(`✨ +${amount} XP! Total: ${totalXP} | Level: ${currentLevel}`);
    } else {
        console.log(`📉 ${amount} XP (Tarefa desmarcada). Total: ${totalXP}`);
    }

    // Sincroniza o XP com o backend do usuário
    try {
        await fetch(`${API_USERS_URL}/${CURRENT_USER_ID}/xp`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });
    } catch (err) {
        console.warn('Não foi possível sincronizar XP com o servidor:', err);
    }

    updateRadarChart();
}

// --- SINCRONIZAÇÃO COM SERVIDOR ---
// Carrega XP e siloXP do TaskController (fonte dos dados de progresso por silo)
// e o level/xp total do UserController (fonte do perfil do usuário).
async function loadStats() {
    try {
        // Stats gerais de tarefas (siloXP para o radar)
        const taskStatsRes = await fetch(`${API_URL}/stats`);
        const taskStats    = await taskStatsRes.json();
        siloXP = taskStats.siloXP || {};

        // Stats do usuário logado (XP total e nível persistido)
        const userStatsRes = await fetch(`${API_USERS_URL}/${CURRENT_USER_ID}/stats`);
        const userStats    = await userStatsRes.json();
        totalXP = userStats.totalXP || 0;

        const currentLevel = Math.floor(totalXP / 100) + 1;
        document.getElementById('xp-counter').textContent = totalXP;
        document.getElementById('user-level').textContent = currentLevel;

        console.log("📊 Stats carregadas:", { totalXP, siloXP });
        updateRadarChart();
    } catch (error) {
        console.error("Erro ao carregar stats:", error);
    }
}

// --- UTILITÁRIOS ---
function formatData(dataString) {
    if (!dataString || dataString === "0") return "Nenhuma data definida";
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
}

// --- SILOS --- (sem alterações)
const btnAddSilo    = document.getElementById('btn-add-silo');
const newSiloForm   = document.getElementById('new-silo-form');
const btnSaveSilo   = document.getElementById('btn-save-silo');
const btnCancelSilo = document.getElementById('btn-cancel-silo');
const inputSiloName = document.getElementById('new-silo-input');
const silosContainer = document.getElementById('silos-container');
const taskSiloSelect = document.getElementById('task-silo');

document.getElementById('task-dependencies')?.addEventListener('mousedown', function(e) {
    if (e.target.tagName === 'OPTION') {
        e.preventDefault();
        e.target.selected = !e.target.selected;
        this.focus();
        this.dispatchEvent(new Event('change'));
    }
});

document.getElementById('toggle-urgent').addEventListener('click', function() {
    filterUrgent = !filterUrgent;
    this.classList.toggle('active');
    loadTasks();
});

document.getElementById('toggle-important').addEventListener('click', function() {
    filterImportant = !filterImportant;
    this.classList.toggle('active');
    loadTasks();
});

document.querySelector('.btn-clear-filters')?.addEventListener('click', () => {
    filterUrgent = false;
    filterImportant = false;
    document.getElementById('toggle-urgent').classList.remove('active');
    document.getElementById('toggle-important').classList.remove('active');
    loadTasks();
});

btnAddSilo?.addEventListener('click', (e) => {
    e.preventDefault();
    newSiloForm.classList.add('show');
    inputSiloName.focus();
});

btnCancelSilo?.addEventListener('click', (e) => {
    e.preventDefault();
    newSiloForm.classList.remove('show');
    inputSiloName.value = "";
});

btnSaveSilo?.addEventListener('click', async (e) => {
    e.preventDefault();
    const siloText  = inputSiloName.value.trim();
    const siloColor = document.getElementById('new-silo-color').value;

    if (siloText !== "") {
        const siloId   = siloText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
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

// --- UI TAREFAS (sem alterações) ---
taskPanel?.addEventListener('click', async (e) => {
    if (!taskPanel.classList.contains('expanded')) {
        taskPanel.classList.add('expanded');
        inputTask.focus();

        try {
            const response = await fetch(API_URL);
            const allTasks = await response.json();
            const depSelect = document.getElementById('task-dependencies');

            if (depSelect) {
                depSelect.innerHTML = '';
                const validTasks = allTasks.filter(t => !t.done && !t.someday);

                if (validTasks.length === 0) {
                    depSelect.innerHTML = '<option disabled>Nenhuma tarefa disponível</option>';
                } else {
                    depSelect.innerHTML = validTasks
                        .map(t => `<option value="${t.id}">${t.content}</option>`)
                        .join('');
                }
            }
        } catch (error) {
            console.error("Erro ao carregar dependências no seletor:", error);
        }
    }
});

btnCancel?.addEventListener('click', (e) => {
    e.stopPropagation();
    taskPanel.classList.remove('expanded');
    inputTask.value = "";
});

// --- SIDEBAR FILTERS (sem alterações) ---
const sidebarMenu = document.querySelector('.sidebar-menu');
sidebarMenu?.addEventListener('click', (e) => {
    const filterBtn = e.target.closest('.filter-btn');
    if (filterBtn) {
        e.preventDefault();
        document.querySelectorAll('.filter-btn').forEach(f => f.classList.remove('active'));
        filterBtn.classList.add('active');
        activeFilter = filterBtn.getAttribute('data-silo');

        const eisenhowerPanel = document.querySelector('.eisenhower-filters');
        const dashboardHeader = document.getElementById('dashboard-header');

        if (activeFilter === 'someday') {
            if (eisenhowerPanel) eisenhowerPanel.style.display = 'none';
            if (dashboardHeader) dashboardHeader.style.display = 'none';
        } else {
            if (eisenhowerPanel) eisenhowerPanel.style.display = 'flex';
        }

        loadTasks();
        updateRadarChart();
    }
});

async function loadSilos() {
    try {
        const response = await fetch(API_SILOS_URL);
        const silos    = await response.json();
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

        const mainTitle = document.querySelector('.task-board h2');
        if (mainTitle) {
            if (activeFilter === 'all') {
                mainTitle.innerHTML = "📜 Suas Tarefas Ativas";
            } else if (activeFilter === 'someday') {
                mainTitle.innerHTML = "⛅ Someday & Ideias";
            } else {
                const activeSiloBtn = document.querySelector(`.filter-btn[data-silo="${activeFilter}"]`);
                if (activeSiloBtn) {
                    mainTitle.innerHTML = activeSiloBtn.textContent.replace('●', '').trim();
                }
            }
        }

        // Filtros de Aba
        if (activeFilter === 'someday') {
            tasks = tasks.filter(t => t.someday === true);
        } else {
            tasks = tasks.filter(t => t.someday === false || t.someday === undefined);
            if (activeFilter !== 'all') {
                tasks = tasks.filter(t => t.silo === activeFilter);
            }
        }

        // Filtros Eisenhower
        if (filterUrgent)    tasks = tasks.filter(t => t.urgent === true);
        if (filterImportant) tasks = tasks.filter(t => t.important === true);

        taskList.innerHTML = '';

        tasks.forEach(task => {
            const isBlocked = task.dependencies && task.dependencies.length > 0 &&
                tasks.some(t =>
                    task.dependencies.map(Number).includes(Number(t.id)) && !t.done
                );

            const li = document.createElement('li');
            li.classList.add('task-item');
            if (task.silo) li.classList.add(task.silo);
            if (isBlocked) li.classList.add('is-blocked');

            let energyHTML = '';
            if (task.energy === 'low')    energyHTML = '<span class="energy-badge energy-low">⚡ Baixa</span>';
            else if (task.energy === 'medium') energyHTML = '<span class="energy-badge energy-medium">⚡⚡ Média</span>';
            else if (task.energy === 'high')   energyHTML = '<span class="energy-badge energy-high">⚡⚡⚡ Alta</span>';

            const siloTagHTML = activeFilter === 'all'
                ? `<span class="silo-tag">${task.silo || 'Geral'}</span>`
                : '';

            li.innerHTML = `
                <div class="task-header">
                    <input type="checkbox" class="checkbox-done" ${task.done ? 'checked' : ''} ${isBlocked ? 'disabled' : ''}>
                    <div style="flex-grow: 1; display: flex; align-items: center;">
                        <label style="${task.done ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                            ${isBlocked ? '🔒 ' : ''}${task.content}
                        </label>
                        ${isBlocked ? '<span class="silo-tag" style="background: #fee2e2; color: #dc2626;">Bloqueada</span>' : ''}
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
                        <p><strong>📝 Notas da Tarefa:</strong></p>
                        <textarea class="edit-description">${task.description || ''}</textarea>
                        <div class="desc-status">Salvo automaticamente</div>
                    </div>
                    <div class="details-panel" style="display: none;">
                        <p><strong>📅 Prazo:</strong> ${formatData(task.date)}</p>
                        <p><strong>🔗 Link:</strong> ${task.link ? `<a href="${task.link}" target="_blank">Abrir</a>` : 'Nenhum'}</p>
                    </div>
                    <div class="subtasks-panel" style="display: none;">
                        <div class="add-subtask-inline">
                            <input type="text" class="new-subtask-text" placeholder="Passo...">
                            <button class="btn-add-sub-inline">➕</button>
                        </div>
                        <ul class="subtask-list-container">
                            ${(task.subTasks || []).map((st, index) => `
                                <li class="subtask-item">
                                    <input type="checkbox" class="sub-check" data-index="${index}" ${st.done ? 'checked' : ''}>
                                    <label>${st.title}</label>
                                </li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;

            // Eventos dos painéis
            const expandedContent = li.querySelector('.task-expanded-content');
            const descPanel       = li.querySelector('.desc-panel');
            const detailsPanel    = li.querySelector('.details-panel');
            const subtasksPanel   = li.querySelector('.subtasks-panel');

            const togglePanel = (panel) => {
                const isVisible = panel.style.display === 'block';
                [descPanel, detailsPanel, subtasksPanel].forEach(p => p.style.display = 'none');
                panel.style.display = isVisible ? 'none' : 'block';
                isVisible
                    ? expandedContent.classList.remove('show')
                    : expandedContent.classList.add('show');
            };

            li.querySelector('.btn-desc').onclick     = () => togglePanel(descPanel);
            li.querySelector('.btn-details').onclick  = () => togglePanel(detailsPanel);
            li.querySelector('.btn-subtasks').onclick = () => togglePanel(subtasksPanel);

            li.querySelector('.checkbox-done').addEventListener('change', async (e) => {
                const isChecked = e.target.checked;
                try {
                    const response = await fetch(`${API_URL}/${task.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...task, done: isChecked })
                    });
                    const data = await response.json();

                    if (data.xpGained !== 0 && data.xpGained !== undefined) {
                        // addXP já cuida de atualizar a UI e sincronizar com /api/users/{id}/xp
                        await addXP(data.xpGained, data.siloAffected);
                    }
                    loadTasks();
                } catch (err) { e.target.checked = !isChecked; }
            });

            li.querySelector('.btn-delete').onclick = async () => {
                await fetch(`${API_URL}/${task.id}`, { method: 'DELETE' });
                loadTasks();
            };

            const btnAddSub = li.querySelector('.btn-add-sub-inline');
            const inputSub  = li.querySelector('.new-subtask-text');

            btnAddSub.onclick = async () => {
                const subText = inputSub.value.trim();
                if (subText) {
                    if (!task.subTasks) task.subTasks = [];
                    task.subTasks.push({ title: subText, done: false });

                    await fetch(`${API_URL}/${task.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(task)
                    });
                    loadTasks();
                }
            };

            li.querySelectorAll('.sub-check').forEach(checkbox => {
                checkbox.addEventListener('change', async (e) => {
                    const index = e.target.dataset.index;
                    task.subTasks[index].done = e.target.checked;

                    await fetch(`${API_URL}/${task.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(task)
                    });
                });
            });

            taskList.appendChild(li);
        });
    } catch (error) { console.error("Erro ao carregar tarefas:", error); }
}

// SALVAR NOVA TAREFA (sem alterações)
btnAddTask?.addEventListener('click', async () => {
    const taskText  = inputTask.value.trim();
    const depSelect = document.getElementById('task-dependencies');
    const selectedDeps = Array.from(depSelect.selectedOptions).map(opt => parseInt(opt.value));

    if (taskText !== "") {
        const newTask = {
            id:         Math.floor(Math.random() * 10000),
            content:    taskText,
            done:       false,
            silo:       document.getElementById('task-silo').value,
            energy:     document.getElementById('task-energy').value,
            link:       document.getElementById('task-link').value,
            date:       document.getElementById('task-date').value,
            urgent:     document.getElementById('task-urgent').checked,
            important:  document.getElementById('task-important').checked,
            someday:    document.getElementById('task-someday').checked,
            dependencies: selectedDeps,
            subTasks:   []
        };

        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });

        inputTask.value = "";
        document.getElementById('task-urgent').checked    = false;
        document.getElementById('task-important').checked = false;
        document.getElementById('task-someday').checked   = false;
        document.getElementById('task-dependencies').innerHTML = '';

        taskPanel.classList.remove('expanded');
        loadTasks();
    }
});

// INICIALIZAÇÃO
loadTasks();
loadSilos();
loadStats();