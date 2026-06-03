// Valida os campos de atualização de perfil
const validarAtualizarPerfil = (nome, email) => {
    if (!nome || !email) {
        return { valido: false, mensagem: 'Nome e email são obrigatórios.' };
    }

    if (nome.trim().length < 2) {
        return { valido: false, mensagem: 'Nome deve ter pelo menos 2 caracteres.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valido: false, mensagem: 'Email inválido.' };
    }

    return { valido: true };
};

// Valida os campos de alteração de senha
const validarAlterarSenha = (senha_atual, nova_senha) => {
    if (!senha_atual || !nova_senha) {
        return { valido: false, mensagem: 'Senha atual e nova senha são obrigatórias.' };
    }

    if (nova_senha.length < 6) {
        return { valido: false, mensagem: 'Nova senha deve ter pelo menos 6 caracteres.' };
    }

    if (senha_atual === nova_senha) {
        return { valido: false, mensagem: 'Nova senha deve ser diferente da senha atual.' };
    }

    return { valido: true };
};

module.exports = { validarAtualizarPerfil, validarAlterarSenha };