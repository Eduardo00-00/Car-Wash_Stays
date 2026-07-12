const express = require('express');
const router = express.Router();
const precioPaqueteController = require('../controllers/precioPaqueteController');
const verificarToken = require('../middleware/authMiddleware');
const verificarRol = require('../middleware/roleMiddleware');

router.post('/configurar', verificarToken, verificarRol(['admin']), precioPaqueteController.configurarPrecios);

router.get('/:paquete_id', verificarToken, verificarRol(['admin', 'lavador', 'cliente']), precioPaqueteController.obtenerPrecios);

module.exports = router;