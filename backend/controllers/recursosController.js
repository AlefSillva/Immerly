const pool = require('../config/db');

const listarRecursos = async ( req, res ) => {
    const { nivel } = req.query;

    try {
        let result;

        if ( nivel ) {
            result = await pool.query(
                `SELECT * FROM recursos 
                WHERE nivel = $1
                ORDER BY nome`,
                [ nivel ]
            );
        } else {
            result = await pool.query(
                `SELECT * FROM recursos
                ORDER BY nome`
            );
        }

        res.json({ recursos: result.rows });

    } catch (err) {
        res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
    }
};

module.exports = { listarRecursos };