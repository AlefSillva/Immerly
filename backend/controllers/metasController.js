const pool = require('../config/db');

const criarMeta = async (req, res) => {
    const id_usuario = req.usuarioId;
    const { meta_semanal, meta_mensal } = req.body;

    if ( !meta_semanal || !meta_mensal ) {
        return res.status(400).json({ message: 'Meta semanal e meta mensal são obrigatórios.' });
    }

    try {
        // Verifica se o usuário já possui metas cadastradas
        const metaExistente = await pool.query(
            `SELECT * FROM metas
            WHERE id_usuario = $1`,
            [id_usuario]
        );

        if ( metaExistente.rows.length > 0 ) {
            return res.status(409).json({ message: 'Você já possui uma meta. Use PUT para atualizá-la.' });
        }

        const result = await pool.query(
            `INSERT INTO metas (id_usuario, meta_semanal, meta_mensal, data_atualizacao)
            VALUES ($1, $2, $3, NOW())
            RETURNING *`,
            [id_usuario, meta_semanal, meta_mensal]
        );

        res.status(201).json({ meta: result.rows[0] });

    } catch (err) { 
        res.status(500).json({ message: 'Erro interno do servidor.', error: err.message });
    }
};

// Atualiza a meta existente do usuário
const atualizarMeta = async (req, res) => {
    const id_usuario = req.usuarioId;
    const { meta_semanal, meta_mensal } = req.body;

    if (!meta_semanal || !meta_mensal) {
        return res.status(400).json({ message: 'Meta semanal e meta mensal são obrigatórios.' });
    }

    if (meta_semanal < 0 || meta_mensal < 0) {
        return res.status(400).json({ message: 'Meta semanal e meta mensal devem ser maiores que zero.' });
    } 

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