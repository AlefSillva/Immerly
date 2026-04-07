const express = require('express');
const router = express.Router();
const metricasController = require('../controllers/metricasController');
const autenticar = require('../middlewares/authMiddleware');

// Buscar todas as métricas do usuário autenticado - protegida
router.get('/', autenticar, metricasController.obter);

module.exports = router;