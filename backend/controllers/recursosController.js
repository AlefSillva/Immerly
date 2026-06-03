const pool = require('../config/db');

const listarRecursos = async ( req, res, next ) => {
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
        next(err);
    }
};

module.exports = { listarRecursos };