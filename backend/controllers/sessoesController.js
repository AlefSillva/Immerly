const { sessoesValidator } = require('../utils/sessoesValidator');

const pool = require('../config/db');

// Criar nova sessão de exposição
const criar = async (req, res, next) => {
    const id_usuario = req.usuarioId;
    const validacao = sessoesValidator(req.body);

    if (!validacao.valido) {
        return res.status(400).json({ message: validacao.message, code: validacao.code  });
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

// Listar sessões do usuário com paginação e filtro por tipo
const listar = async (req, res, next) => {
    const id_usuario = req.usuarioId;

    // Parâmetros de paginação e filtro via query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const tipo = req.query.tipo || null;
    const offset = (page - 1) * limit;

    try {
        // Conta o total de sessões para calcular o total de páginas
        const totalResult = await pool.query(
            `SELECT COUNT(*) FROM sessoes
            WHERE id_usuario = $1
            ${tipo ? 'AND tipo = $2' : ''}`,
            tipo ? [id_usuario, tipo] : [id_usuario]
        );

        const total = parseInt(totalResult.rows[0].count);
        const totalPaginas = Math.ceil(total / limit);

        // Busca as sessões com paginação e filtro
        const sessoes = await pool.query(
            `SELECT * FROM sessoes
            WHERE id_usuario = $1
            ${tipo ? 'AND tipo = $2' : ''}
            ORDER BY data DESC
            LIMIT $${tipo ? 3 : 2} OFFSET $${tipo ? 4 : 3}`,
            tipo ? [id_usuario, tipo, limit, offset] : [id_usuario, limit, offset]
        );

        res.json({
            sessoes: sessoes.rows,
            paginacao: {
                total,
                totalPaginas,
                paginaAtual: page,
                limit
            }
        });

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
        return res.status(400).json({ message: validacao.message, code: validacao.code });
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
            return res.status(404).json({ message: 'Sessão não encontrada.', code: 'SESSAO_NAO_ENCONTRADA' });
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
            return res.status(404).json({ message: 'Sessão não encontrada.', code: 'SESSAO_NAO_ENCONTRADA' });
        }

        res.json({ message: 'Sessão deletada com sucesso.' });

    } catch (err) {
        next(err);
    }
};

module.exports = { criar, listar, atualizar, deletar };

