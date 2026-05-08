const express = require('express');
const router = express.Router();
const { obterCI } = require('../controllers/ciController');


// Rota para obter conteúdo de Comprehensible Input, com autenticação 
router.get('/',  obterCI);

module.exports = router;
