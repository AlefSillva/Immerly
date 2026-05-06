const express = require('express');
const router = express.Router();
const { criarMeta, atualizarMeta, buscarMeta } = require('../controllers/metasController');
const autenticar = require('../middlewares/authMiddleware');

router.post('/', autenticar, criarMeta);
router.put('/', autenticar, atualizarMeta);
router.get('/', autenticar, buscarMeta);

module.exports = router;