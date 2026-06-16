// Valida os campos de atualização de perfil
const validarAtualizarPerfil = (nome, email) => {
    if (!nome && !email) {
        return { valido: false, mensagem: 'Informe ao menos nome ou email.', code: 'CAMPOS_OBRIGATORIOS' };
    }

    if (nome && nome.trim().length < 2) {
        return { valido: false, mensagem: 'Nome deve ter pelo menos 2 caracteres.', code: 'NOME_INVALIDO' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        return { valido: false, mensagem: 'Email inválido.', code: 'EMAIL_INVALIDO' };
    }

    return { valido: true };
};

// Valida os campos de alteração de senha
const validarAlterarSenha = (senha_atual, nova_senha) => {
    if (!senha_atual || !nova_senha) {
        return { valido: false, mensagem: 'Senha atual e nova senha são obrigatórias.', code: 'CAMPOS_OBRIGATORIOS' };
    }

    if (nova_senha.length < 6) {
        return { valido: false, mensagem: 'Nova senha deve ter pelo menos 6 caracteres.', code: 'SENHA_INVALIDA' };
    }

    if (senha_atual === nova_senha) {
        return { valido: false, mensagem: 'Nova senha deve ser diferente da senha atual.', code: 'SENHA_REPETIDA' };
    }

    return { valido: true };
};

module.exports = { validarAtualizarPerfil, validarAlterarSenha };