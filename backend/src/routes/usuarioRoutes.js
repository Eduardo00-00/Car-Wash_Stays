const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const verificarToken = require('../middleware/authMiddleware');

// Esta ruta SÍ necesita protección porque solo el dueño debe ver su perfil
router.get('/perfil', verificarToken, usuarioController.obtenerPerfil);

module.exports = router;