const pool = require('../config/db');

const verificarAdmin = async (req, res, next) => {
    try {
        // Busca o usuário no banco para verificar se é admin
        const resultado = await pool.query(
            'SELECT is_admin FROM usuarios WHERE id = $1',
            [req.usuarioId]
        );

        // Verifica se o usuário existe
        if (resultado.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Verifica se o usuário tem permissão de admin
        if (!resultado.rows[0].is_admin) {
            return res.status(403).json({ message: 'Acesso negado. Você não tem permissão de administrador.' });
        }

        // Usuário é admin, segue para a rota
        next();

    } catch (err) {
        res.status(500).json({ message: 'Erro interno do servidor.', error: err.message });
    }
};

module.exports = verificarAdmin;