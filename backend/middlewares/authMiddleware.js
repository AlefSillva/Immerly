const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
    // Pega o token do cabeçalho da requisição
    const authHeader = req.headers['authorization'];

    // Verifica se o token foi enviado
    if ( !authHeader ) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    // O token vem no formato 'Bearer códigoDoToken' | pegamos só o código
    const token = authHeader.split(' ')[1];

    try {
        // Verifica se o token é válido e não expirou
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adiciona o id do usuário na requisição para usar nas rotas
        req.usuarioId = decoded.id;

        // Chama o próximo middleware ou a rota
        next();

    } catch (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = autenticar;