const API_USERS_URL = 'http://localhost:8080/api/users';

const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm-password');
const strengthLabel = document.getElementById('strength-label');
const segments = [
    document.getElementById('seg-1'),
    document.getElementById('seg-2'),
    document.getElementById('seg-3'),
    document.getElementById('seg-4'),
];
const stepDots = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
];

// Atualiza barra de força da senha
passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    let strength = 0;

    if (val.length >= 8) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;

    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
    const labels = ['Muito fraca', 'Fraca', 'Boa', 'Forte'];

    segments.forEach((seg, i) => {
        seg.style.background = i < strength ? colors[strength - 1] : '#e2e8f0';
    });

    strengthLabel.textContent = val.length === 0 ? 'Digite uma senha' : labels[strength - 1] || 'Muito fraca';
    strengthLabel.style.color = val.length === 0 ? '#94a3b8' : colors[strength - 1] || colors[0];

    updateProgress();
});

// Atualiza indicador de progresso conforme preenche
const firstNameInput = document.getElementById('first-name');
const emailInput = document.getElementById('email');

function updateProgress() {
    const step1 = firstNameInput.value.length > 0;
    const step2 = emailInput.value.includes('@');
    const step3 = passwordInput.value.length >= 8;

    stepDots[0].classList.toggle('active', true);
    stepDots[1].classList.toggle('active', step1 && step2);
    stepDots[2].classList.toggle('active', step1 && step2 && step3);
}

[firstNameInput, emailInput, passwordInput].forEach(el => {
    el.addEventListener('input', updateProgress);
});

// Validação e submissão
document.getElementById('register-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    let valid = true;

    const firstName = document.getElementById('first-name').value.trim();
    const lastName  = document.getElementById('last-name').value.trim();
    const email     = emailInput.value.trim();
    const password  = passwordInput.value;
    const confirm   = confirmInput.value;
    const termsChecked = document.getElementById('terms').checked;

    // Limpa erros
    document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('input').forEach(el => {
        el.classList.remove('error');
        el.classList.remove('success');
    });

    if (!firstName) {
        showError('err-first-name', 'first-name');
        valid = false;
    } else {
        document.getElementById('first-name').classList.add('success');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('err-email', 'email');
        valid = false;
    } else {
        emailInput.classList.add('success');
    }

    if (password.length < 8) {
        showError('err-password', 'password');
        valid = false;
    }

    if (password !== confirm || confirm === '') {
        showError('err-confirm', 'confirm-password');
        valid = false;
    }

    if (!termsChecked) {
        alert('Você precisa aceitar os Termos de Uso para continuar.');
        valid = false;
    }

    if (!valid) return;

    const btn = document.getElementById('btn-submit');
    btn.textContent = 'Criando conta...';
    btn.disabled = true;

    try {
        const response = await fetch(`${API_USERS_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                // Em produção: envie apenas o hash (ex: SHA-256). Nunca a senha pura por HTTPS em prod sem TLS.
                passwordHash: password
            })
        });

        if (response.status === 409) {
            // E-mail já cadastrado
            btn.textContent = 'Criar Conta Grátis';
            btn.disabled = false;
            showError('err-email', 'email');
            document.getElementById('err-email').textContent = 'Este e-mail já está em uso.';
            return;
        }

        if (!response.ok) {
            throw new Error('Erro no servidor.');
        }

        const user = await response.json();

        // Salva o ID do usuário para uso no dashboard
        localStorage.setItem('prismalife_user_id', user.id);
        localStorage.setItem('prismalife_user_name', user.firstName);

        document.getElementById('form-wrapper').style.display = 'none';
        document.getElementById('success-screen').classList.add('show');

    } catch (err) {
        console.error('Erro no registro:', err);
        btn.textContent = 'Criar Conta Grátis';
        btn.disabled = false;
        alert('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    }
});

function showError(msgId, inputId) {
    document.getElementById(msgId).classList.add('show');
    document.getElementById(inputId).classList.add('error');
}

function handleSocial(provider) {
    alert(`Autenticação com ${provider} em breve!`);
}