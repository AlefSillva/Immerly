const { sessoesValidator } = require('../utils/sessoesValidator');

const pool = require('../config/db');

// Criar nova sessão de exposição
const criar = async (req, res) => {
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
        res.status(500).json({ message: 'Erro interno do servidor.', error: err.message });
    }
};

// Listar todas as sessões do usuário autenticado
const listar = async (req, res) => {
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
        res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
    }
};

module.exports = { criar, listar}

