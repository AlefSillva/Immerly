// Valida os campos de registro de usuário
const validarRegister = (nome, email, senha) => {
    // Verifica se todos os campos estão presentes
    if (!nome || !email || !senha) {
        return { valido: false, mensagem: 'Todos os campos são obrigatórios.', code: 'CAMPOS_OBRIGATORIOS'  };
    }

    // Valida tamanho mínimo do nome
    if (nome.trim().length < 2) {
        return { valido: false, mensagem: 'Nome deve ter pelo menos 2 caracteres.', code: 'NOME_INVALIDO' };
    }

    // Valida formato do email com regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valido: false, mensagem: 'Email inválido.', code: 'EMAIL_INVALIDO' };
    }

    // Valida tamanho mínimo da senha
    if (senha.length < 6) {
        return { valido: false, mensagem: 'Senha deve ter pelo menos 6 caracteres.', code: 'SENHA_INVALIDA' };
    }

    return { valido: true };
};

// Valida os campos de login
const validarLogin = (email, senha) => {
    if (!email || !senha) {
        return { valido: false, mensagem: 'Email e senha são obrigatórios.', code: 'CAMPOS_OBRIGATORIOS' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valido: false, mensagem: 'Email inválido.', code: 'EMAIL_INVALIDO' };
    }

    return { valido: true };
};

module.exports = { validarRegister, validarLogin };