const express = require('express');
const router = express.Router();
const sessoesController = require('../controllers/sessoesController');
const autenticar = require('../middlewares/authMiddleware');

// Criar nova sessão - protegida
router.post('/', autenticar, sessoesController.criar);

// Listar sessões do usuário - protegido
router.get('/', autenticar, sessoesController.listar);

module.exports = router;