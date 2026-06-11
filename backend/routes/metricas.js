const express = require('express');
const router = express.Router();
const { obter, historico, evolucaoNivel, horasPorMes, horasPorTipoPorMes  } = require('../controllers/metricasController');
const autenticar = require('../middlewares/authMiddleware');

// Buscar todas as métricas do usuário autenticado - protegida
router.get('/', autenticar, obter);

// Buscar Histórivo do usuario
router.get('/historico', autenticar, historico);

// Buscar evolução do nível do usuário
router.get('/evolucao-nivel', autenticar, evolucaoNivel);

// Buscar horas por mês
router.get('/horas-por-mes', autenticar, horasPorMes);

// Buscar horas por tipo por mês
router.get('/horas-por-tipo-mes', autenticar, horasPorTipoPorMes);

module.exports = router;