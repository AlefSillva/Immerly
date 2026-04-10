const express = require('express');
const router = express.Router();
const { obterCI } = require('../controllers/ciController');
const autenticar = require('../middlewares/authMiddleware');

// Rota para obter conteúdo de Comprehensible Input, com autenticação 
router.get('/', autenticar, obterCI);

module.exports = router;
