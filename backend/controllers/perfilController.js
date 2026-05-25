const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Busca os dados do usuário logado
const buscarPerfil = async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT id, nome, email, data_cadastro FROM usuarios WHERE id = $1',
            [req.usuarioId]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.json({ usuario: resultado.rows[0] });

    } catch (err) {
        res.status(500).json({ message: 'Erro interno do servidor.', error: err.message });
    }
};

// Atualiza nome e/ou email do usuário
const atualizarPerfil = async (req, res) => {
    const { nome, email } = req.body;

    try {
        // Verifica se o email já está em uso por outro usuário
        if (email) {
            const emailExiste = await pool.query(
                'SELECT id FROM usuarios WHERE email = $1 AND id != $2',
                [email, req.usuarioId]
            );

            if (emailExiste.rows.length > 0) {
                return res.status(400).json({ message: 'Email já está em uso.' });
            }
        }

        const resultado = await pool.query(
            'UPDATE usuarios SET nome = COALESCE($1, nome), email = COALESCE($2, email) WHERE id = $3 RETURNING id, nome, email',
            [nome || null, email || null, req.usuarioId]
        );

        res.json({ message: 'Perfil atualizado com sucesso!', usuario: resultado.rows[0] });

    } catch (err) {
        res.status(500).json({ message: 'Erro interno do servidor.', error: err.message });
    }
};

// Altera a senha do usuário
const alterarSenha = async (req, res) => {
    const { senha_atual, nova_senha } = req.body;

    try {
        // Busca a senha atual do banco
        const resultado = await pool.query(
            'SELECT senha FROM usuarios WHERE id = $1',
            [req.usuarioId]
        );

        const senhaValida = await bcrypt.compare(senha_atual, resultado.rows[0].senha);

        if (!senhaValida) {
            return res.status(400).json({ message: 'Senha atual incorreta.' });
        }

        // Criptografa a nova senha
        const salt = await bcrypt.genSalt(10);
        const novaSenhaCriptografada = await bcrypt.hash(nova_senha, salt);

        await pool.query(
            'UPDATE usuarios SET senha = $1 WHERE id = $2',
            [novaSenhaCriptografada, req.usuarioId]
        );

        res.json({ message: 'Senha alterada com sucesso!' });

    } catch (err) {
        res.status(500).json({ message: 'Erro interno do servidor.', error: err.message });
    }
};

// Deleta a conta do usuário
const deletarConta = async (req, res) => {
    try {
        await pool.query('DELETE FROM usuarios WHERE id = $1', [req.usuarioId]);
        res.json({ message: 'Conta deletada com sucesso.' });
    } catch (err) {
        res.status(500).json({ message: 'Erro interno do servidor.', error: err.message });
    }
};

module.exports = { buscarPerfil, atualizarPerfil, alterarSenha, deletarConta };