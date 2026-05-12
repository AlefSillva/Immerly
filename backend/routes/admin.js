const express = require('express');
const router = express.Router();
const autenticar = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/adminMiddleware');
const { listarRecursos, criarRecurso, atualizarRecurso, deletarRecurso } = require('../controllers/adminController');

// Todas as rotas de admin exigem autenticação + permissão de admin
router.get('/recursos', autenticar, verificarAdmin, listarRecursos);
router.post('/recursos', autenticar, verificarAdmin, criarRecurso);
router.put('/recursos/:id', autenticar, verificarAdmin, atualizarRecurso);
router.delete('/recursos/:id', autenticar, verificarAdmin, deletarRecurso);

module.exports = router;