// Valida os campos de registro de usuário
const validarRegister = (nome, email, senha) => {
    // Verifica se todos os campos estão presentes
    if (!nome || !email || !senha) {
        return { valido: false, mensagem: 'Todos os campos são obrigatórios.' };
    }

    // Valida tamanho mínimo do nome
    if (nome.trim().length < 2) {
        return { valido: false, mensagem: 'Nome deve ter pelo menos 2 caracteres.' };
    }

    // Valida formato do email com regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valido: false, mensagem: 'Email inválido.' };
    }

    // Valida tamanho mínimo da senha
    if (senha.length < 6) {
        return { valido: false, mensagem: 'Senha deve ter pelo menos 6 caracteres.' };
    }

    return { valido: true };
};

// Valida os campos de login
const validarLogin = (email, senha) => {
    if (!email || !senha) {
        return { valido: false, mensagem: 'Email e senha são obrigatórios.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valido: false, mensagem: 'Email inválido.' };
    }

    return { valido: true };
};

module.exports = { validarRegister, validarLogin };