const pool = require('../config/db');

// Lista todos os recursos (para exibir na tabela do admin)
const listarRecursos = async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM recursos ORDER BY tipo, nivel, nome'
        );
        res.json(resultado.rows);
    } catch (err) {
        res.status(500).json({ message: 'Erro interno do servidor.', error: err.message });
    }
};

// Cria um novo recurso
const criarRecurso = async (req, res) => {
    const { nome, tipo, nivel, descricao, link_externo } = req.body;

    try {
        const resultado = await pool.query(
            'INSERT INTO recursos (nome, tipo, nivel, descricao, link_externo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, tipo, nivel || null, descricao, link_externo]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Erro interno do servidor.', error: err.message });
    }
};

// Atualiza um recurso existente
const atualizarRecurso = async (req, res) => {
    const { id } = req.params;
    const { nome, tipo, nivel, descricao, link_externo } = req.body;

    try {
        const resultado = await pool.query(
            'UPDATE recursos SET nome = $1, tipo = $2, nivel = $3, descricao = $4, link_externo = $5 WHERE id = $6 RETURNING *',
            [nome, tipo, nivel || null, descricao, link_externo, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ message: 'Recurso não encontrado.' });
        }

        res.json(resultado.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Erro interno do servidor.', error: err.message });
    }
};

// Deleta um recurso
const deletarRecurso = async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await pool.query(
            'DELETE FROM recursos WHERE id = $1 RETURNING *',
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ message: 'Recurso não encontrado.' });
        }

        res.json({ message: 'Recurso deletado com sucesso.' });
    } catch (err) {
        res.status(500).json({ message: 'Erro interno do servidor.', error: err.message });
    }
};

module.exports = { listarRecursos, criarRecurso, atualizarRecurso, deletarRecurso };