const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const verificarToken = require('../middleware/authMiddleware');

router.get('/perfil', verificarToken, usuarioController.obtenerPerfil);

module.exports = router;