const express = require('express');
const router = express.Router();
const { obter, historico } = require('../controllers/metricasController');
const autenticar = require('../middlewares/authMiddleware');

// Buscar todas as métricas do usuário autenticado - protegida
router.get('/', autenticar, obter);

// Buscar Histórivo do usuario
router.get('/historico', autenticar, historico);

module.exports = router;