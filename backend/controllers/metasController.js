const { validarCamposMetas } = require('../utils/metasValidator');

const pool = require('../config/db');

const criarMeta = async (req, res) => {
    const id_usuario = req.usuarioId;
    const { meta_semanal, meta_mensal } = req.body;

    const validacao = validarCamposMetas(meta_semanal, meta_mensal);

    // Se a validação falhar, retorna um erro com a mensagem apropriada
    if ( !validacao.valido ) {
        return res.status(400).json({ message: validacao.mensagem });
    }

    try {
        // Verifica se o usuário já possui metas cadastradas
        const metaExistente = await pool.query(
            `SELECT * FROM metas
            WHERE id_usuario = $1`,
            [id_usuario]
        );

        // Se já existir uma meta para o usuário, retorna um erro informando que ele deve usar PUT para atualizar
        if ( metaExistente.rows.length > 0 ) {
            return res.status(409).json({ message: 'Você já possui uma meta. Use PUT para atualizá-la.' });
        }

        // Insere a nova meta no banco de dados
        const result = await pool.query(
            `INSERT INTO metas (id_usuario, meta_semanal, meta_mensal, data_atualizacao)
            VALUES ($1, $2, $3, NOW())
            RETURNING *`,
            [id_usuario, meta_semanal, meta_mensal]
        );

        // Retorna a meta criada
        res.status(201).json({ meta: result.rows[0] });

    } catch (err) { 
        res.status(500).json({ message: 'Erro interno do servidor.', error: err.message });
    }
};

// Atualiza a meta existente do usuário
const atualizarMeta = async (req, res) => {
    const id_usuario = req.usuarioId;
    const { meta_semanal, meta_mensal } = req.body;

    const validacao = validarCamposMetas(meta_semanal, meta_mensal);

    // Se a validação falhar, retorna um erro com a mensagem apropriada
    if ( !validacao.valido ) {
        return res.status(400).json({ message: validacao.mensagem });
    }


    // Atualiza a meta do usuário no banco de dados
    try {
        const result = await pool.query(
            `UPDATE metas
            SET meta_semanal = $1, meta_mensal = $2, data_atualizacao = NOW()
            WHERE id_usuario = $3
            RETURNING *`,
            [meta_semanal, meta_mensal, id_usuario]
        );

        //Se nenhuma linha foi afetada, o usuário não possui uma meta cadastrada
        if(result.rows.length === 0) {
            return res.status(404).json({ message: 'Nenhuma meta encontrada. Use POST para criar uma.' });
        }

        res.json({ meta: result.rows[0] });
    } catch (err) { 
        res.status(500).json({ message: 'Erro interno do servidor.', error: err.message });
    }
};

module.exports = { criarMeta, atualizarMeta };