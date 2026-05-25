const express = require('express');
const router = express.Router();
const autenticar = require('../middlewares/authMiddleware');
const { buscarPerfil, atualizarPerfil, alterarSenha, deletarConta  } = require('../controllers/perfilController');

// Todas as rotas de perfil exigem autenticação
router.get('/', autenticar, buscarPerfil);
router.put('/', autenticar, atualizarPerfil);
router.put('/senha', autenticar, alterarSenha);
router.delete('/', autenticar, deletarConta);

module.exports = router;