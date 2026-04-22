console.log("PrismaLife Web Inicializado! 💎");

// --- CONFIGURAÇÃO GLOBAL ---
const API_URL = 'http://localhost:8080/api/tasks';
const API_SILOS_URL = 'http://localhost:8080/api/silos';

// Elementos do DOM
const btnAddTask = document.getElementById('btn-add-task');
const inputTask = document.getElementById('new-task-input');
const taskList = document.getElementById('task-list');
const taskPanel = document.getElementById('task-panel');
const btnCancel = document.getElementById('btn-cancel');

// VARIÁVEIS DE ESTADO
let totalXP = 0;
let siloXP = {};
let lifeChart = null;
let activeFilter = 'all';

// --- SISTEMA DE GRÁFICO (RADAR) ---
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
    const labels = Object.keys(siloXP);
    const dataValues = Object.values(siloXP);

    if (lifeChart) {
        lifeChart.destroy();
    }

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
                layout: {
                    padding: 20
                },
                scales: {
                    r: {
                        angleLines: { color: '#556387' },
                        grid: { color: '#556387' },
                        pointLabels: { color: '#cbd5e1', font: { size: 14 } },
                        ticks: {
                            display: false,
                            stepSize: 20
                        },
                        suggestedMin: 0
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
}

// --- SISTEMA DE XP ---
function addXP(amount, siloId) {
    if (amount <= 0) return;

    totalXP += amount;

    if (siloId && siloId !== "") {
        if (!siloXP[siloId]) siloXP[siloId] = 0;
        siloXP[siloId] += amount;
    }

    const currentLevel = Math.floor(totalXP / 100) + 1;
    document.getElementById('xp-counter').textContent = totalXP;
    document.getElementById('user-level').textContent = currentLevel;

    const statsCard = document.getElementById('user-stats-card');
    if (statsCard) {
        statsCard.classList.add('xp-glow');
        setTimeout(() => statsCard.classList.remove('xp-glow'), 400);
    }

    console.log(`✨ +${amount} XP! Total: ${totalXP} | Level: ${currentLevel}`);
    updateRadarChart();
}

// --- SINCRONIZAÇÃO COM SERVIDOR ---
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const stats = await response.json();

        totalXP = stats.totalXP || 0;
        siloXP = stats.siloXP || {};

        const currentLevel = Math.floor(totalXP / 100) + 1;
        document.getElementById('xp-counter').textContent = totalXP;
        document.getElementById('user-level').textContent = currentLevel;

        console.log("📊 Stats loaded:", stats);
        updateRadarChart();
    } catch (error) {
        console.error("Error loading stats:", error);
    }
}

// --- UTILITÁRIOS ---
function formatData(dataString) {
    if (!dataString || dataString === "0") return "Nenhuma data definida";
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
}

// --- SILOS ---
const btnAddSilo = document.getElementById('btn-add-silo');
const newSiloForm = document.getElementById('new-silo-form');
const btnSaveSilo = document.getElementById('btn-save-silo');
const btnCancelSilo = document.getElementById('btn-cancel-silo');
const inputSiloName = document.getElementById('new-silo-input');
const silosContainer = document.getElementById('silos-container');
const taskSiloSelect = document.getElementById('task-silo');

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
    const siloText = inputSiloName.value.trim();
    const siloColor = document.getElementById('new-silo-color').value;

    if (siloText !== "") {
        const siloId = siloText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
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

// --- UI TAREFAS ---
taskPanel?.addEventListener('click', (e) => {
    if (!taskPanel.classList.contains('expanded')) {
        taskPanel.classList.add('expanded');
        inputTask.focus();
    }
});

btnCancel?.addEventListener('click', (e) => {
    e.stopPropagation();
    taskPanel.classList.remove('expanded');
    inputTask.value = "";
});

// --- SIDEBAR FILTERS ---
const sidebarMenu = document.querySelector('.sidebar-menu');
sidebarMenu?.addEventListener('click', (e) => {
    const filterBtn = e.target.closest('.filter-btn');
    if (filterBtn) {
        e.preventDefault();
        document.querySelectorAll('.filter-btn').forEach(f => f.classList.remove('active'));
        filterBtn.classList.add('active');
        activeFilter = filterBtn.getAttribute('data-silo');
        loadTasks();
        updateRadarChart();
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
            const descPanel = li.querySelector('.desc-panel');
            const detailsPanel = li.querySelector('.details-panel');
            const subtasksPanel = li.querySelector('.subtasks-panel');

            const togglePanel = (panel) => {
                const isVisible = panel.style.display === 'block';
                [descPanel, detailsPanel, subtasksPanel].forEach(p => p.style.display = 'none');
                panel.style.display = isVisible ? 'none' : 'block';
                isVisible ? expandedContent.classList.remove('show') : expandedContent.classList.add('show');
            };

            li.querySelector('.btn-desc').onclick = () => togglePanel(descPanel);
            li.querySelector('.btn-details').onclick = () => togglePanel(detailsPanel);
            li.querySelector('.btn-subtasks').onclick = () => togglePanel(subtasksPanel);

            // Checkbox principal (XP)
            li.querySelector('.checkbox-done').addEventListener('change', async (e) => {
                const isChecked = e.target.checked;
                try {
                    const response = await fetch(`${API_URL}/${task.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...task, done: isChecked })
                    });
                    const data = await response.json();
                    if (data.xpGained > 0) addXP(data.xpGained, data.siloAffected);
                    loadTasks();
                } catch (err) { e.target.checked = !isChecked; }
            });

            li.querySelector('.btn-delete').onclick = async () => {
                await fetch(`${API_URL}/${task.id}`, { method: 'DELETE' });
                loadTasks();
            };

            taskList.appendChild(li);
        });
    } catch (error) { console.error("Erro ao carregar tarefas:", error); }
}

// SALVAR NOVA TAREFA
btnAddTask?.addEventListener('click', async () => {
    const taskText = inputTask.value.trim();
    if(taskText !== "") {
        const newTask = {
            id: Math.floor(Math.random() * 10000),
            content: taskText,
            done: false,
            silo: document.getElementById('task-silo').value,
            energy: document.getElementById('task-energy').value,
            link: document.getElementById('task-link').value,
            date: document.getElementById('task-date').value,
            subTasks: []
        };
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });
        inputTask.value = "";
        taskPanel.classList.remove('expanded');
        loadTasks();
    }
});

// INICIALIZAÇÃO
loadTasks();
loadSilos();
loadStats();