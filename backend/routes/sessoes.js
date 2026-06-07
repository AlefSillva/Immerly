const express = require('express');
const router = express.Router();
const sessoesController = require('../controllers/sessoesController');
const autenticar = require('../middlewares/authMiddleware');

// Criar nova sessão - protegida
router.post('/', autenticar, sessoesController.criar);

// Listar sessões do usuário - protegido
router.get('/', autenticar, sessoesController.listar);

// Atualizar sessão - protegida
router.put('/:id', autenticar, sessoesController.atualizar);

// Deletar sessão - protegida
router.delete('/:id', autenticar, sessoesController.deletar);

module.exports = router;