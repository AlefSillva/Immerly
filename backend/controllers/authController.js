const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const userExists = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        const novoUsuario = await pool.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email',
            [nome, email, senhaCriptografada]
        );

        res.status(201).json({ message: 'Usuário criado com sucesso!', usuario: novoUsuario.rows[0] })

    } catch (err) {
        res.status(500).json({ message: 'Erro interno do servidor', error: err.message })
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );

        if (usuario.rows.length === 0) {
            return res.status(400).json({ message: 'Email ou senha inválidos.' })
        }

        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha);

        if (!senhaValida) {
            return res.status(400).json({ message: 'Email ou senha inválidos.' })
        }

        const token = jwt.sign(
            { id: usuario.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, usuario: { id: usuario.rows[0].id, nome: usuario.rows[0].nome, email: usuario.rows[0].email } });

    } catch (err) {
        res.status(500).json({ message: 'Erro interno do servidor.', error: err.message });
    }
};

module.exports = { register, login };