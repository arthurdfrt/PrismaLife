const API_USERS_URL = 'http://localhost:8080/api/users';

// Mostrar/ocultar senha
const pwInput = document.getElementById('password');
const toggleBtn = document.getElementById('toggle-pw');
let pwVisible = false;

toggleBtn.addEventListener('click', () => {
    pwVisible = !pwVisible;
    pwInput.type = pwVisible ? 'text' : 'password';
    toggleBtn.textContent = pwVisible ? '🙈' : '👁️';
});

// Validação e submissão
document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email    = document.getElementById('email').value.trim();
    const password = pwInput.value;

    // Limpa erros anteriores
    document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('input[type="email"], input[type="password"]').forEach(el => el.classList.remove('error'));
    document.getElementById('alert-error').classList.remove('show');

    let valid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('err-email', 'email');
        valid = false;
    }

    if (password.length === 0) {
        showError('err-password', 'password');
        valid = false;
    }

    if (!valid) return;

    const btn     = document.getElementById('btn-submit');
    const btnText = document.getElementById('btn-text');
    const spinner = document.getElementById('spinner');

    btn.disabled = true;
    btnText.textContent = 'Entrando...';
    spinner.style.display = 'block';

    try {
        const response = await fetch(`${API_USERS_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, passwordHash: password })
        });

        if (response.status === 401) {
            // Credenciais inválidas
            btn.disabled = false;
            btnText.textContent = 'Entrar';
            spinner.style.display = 'none';
            document.getElementById('alert-error').classList.add('show');
            document.getElementById('email').classList.add('error');
            pwInput.classList.add('error');
            return;
        }

        if (!response.ok) {
            throw new Error('Erro no servidor.');
        }

        const user = await response.json();

        // Salva o ID e nome do usuário para uso no dashboard
        localStorage.setItem('prismalife_user_id', user.id);
        localStorage.setItem('prismalife_user_name', user.firstName);

        document.getElementById('form-wrapper').style.display = 'none';
        document.getElementById('success-screen').classList.add('show');

        // Redireciona após um breve delay para o usuário ver a tela de sucesso
        setTimeout(() => { window.location.href = 'index.html'; }, 1500);

    } catch (err) {
        console.error('Erro no login:', err);
        btn.disabled = false;
        btnText.textContent = 'Entrar';
        spinner.style.display = 'none';
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