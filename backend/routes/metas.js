const express = require('express');
const router = express.Router();
const { criarMeta, atualizarMeta } = require('../controllers/metasController');
const autenticar = require('../middlewares/authMiddleware');

router.post('/', autenticar, criarMeta);
router.put('/', autenticar, atualizarMeta);

module.exports = router;