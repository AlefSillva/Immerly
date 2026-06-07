const { sessoesValidator } = require('../utils/sessoesValidator');

const pool = require('../config/db');

// Criar nova sessão de exposição
const criar = async (req, res, next) => {
    const id_usuario = req.usuarioId;
    const validacao = sessoesValidator(req.body);

    if (!validacao.valido) {
        return res.status(400).json({ message: validacao.message });
    }

    const { nome_conteudo, tipo, duracao_minutos, nivel_estimado, grau_compreensao } = req.body;

    // Inserir nova sessão no banco de dados
    try {
        const novaSessao = await pool.query(
            `INSERT INTO sessoes
            (id_usuario, nome_conteudo, tipo, duracao_minutos, nivel_estimado, grau_compreensao) 
            VALUES ( $1, $2, $3, $4, $5, $6 )
            RETURNING *`,
            [id_usuario, nome_conteudo, tipo, duracao_minutos, nivel_estimado, grau_compreensao]
        );

        // Retornar a nova sessão criada
        res.status(201).json({
            message: 'Sessão registrada com sucesso!',
            sessao: novaSessao.rows[0]
        });
        
    } catch (err) {
        next(err);
    }
};

// Listar todas as sessões do usuário autenticado
const listar = async (req, res, next) => {
    const id_usuario = req.usuarioId;

    // Buscar sessões do usuário no banco de dados, ordenando da mais recente para a mais antiga
    try {
        const sessoes = await pool.query(
            `SELECT * FROM sessoes
            WHERE id_usuario = $1
            ORDER BY data DESC` ,
            [id_usuario]
        );

        res.json({ sessoes: sessoes.rows });

    } catch (err) {
        next(err);
    }
};

// Atualizar sessão existente
const atualizar = async (req, res, next) => {
    const id_usuario = req.usuarioId;
    const { id } = req.params;

    const validacao = sessoesValidator(req.body);
    if (!validacao.valido) {
        return res.status(400).json({ message: validacao.message });
    }

    const { nome_conteudo, tipo, duracao_minutos, nivel_estimado, grau_compreensao } = req.body;

    try {
        const resultado = await pool.query(
            `UPDATE sessoes
            SET nome_conteudo = $1, tipo = $2, duracao_minutos = $3, nivel_estimado = $4, grau_compreensao = $5
            WHERE id = $6 AND id_usuario = $7
            RETURNING *`,
            [nome_conteudo, tipo, duracao_minutos, nivel_estimado, grau_compreensao, id, id_usuario]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ message: 'Sessão não encontrada.' });
        }

        res.json({ message: 'Sessão atualizada com sucesso!', sessao: resultado.rows[0] });

    } catch (err) {
        next(err);
    }
};

// Deletar sessão
const deletar = async (req, res, next) => {
    const id_usuario = req.usuarioId;
    const { id } = req.params;

    try {
        const resultado = await pool.query(
            `DELETE FROM sessoes
            WHERE id = $1 AND id_usuario = $2
            RETURNING *`,
            [id, id_usuario]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ message: 'Sessão não encontrada.' });
        }

        res.json({ message: 'Sessão deletada com sucesso.' });

    } catch (err) {
        next(err);
    }
};

module.exports = { criar, listar, atualizar, deletar };

