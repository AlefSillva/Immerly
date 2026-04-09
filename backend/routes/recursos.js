const express = require('express');
const router = express.Router();
const { listarRecursos } = require('../controllers/recursosController');
const autenticar = require('../middlewares/authMiddleware');

// Rota para listar recursos, com autenticação
router.get('/', autenticar, listarRecursos);

module.exports = router;