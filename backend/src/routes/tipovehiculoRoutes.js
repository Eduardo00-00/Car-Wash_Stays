const express = require('express');
const router = express.Router();
const tipovehiculoController = require('../controllers/tipovehiculoController');
const verificarToken = require('../middleware/authMiddleware');
const verificarRol = require('../middleware/roleMiddleware');

// Solo Admin puede crear nuevos tipos
router.post('/crear', verificarToken, verificarRol(['admin']), tipovehiculoController.registrarTipoVehiculo);

// Todos los roles logueados pueden ver el catálogo
router.get('/', verificarToken, verificarRol(['admin', 'lavador', 'cliente']), tipovehiculoController.obtenerTipos);

module.exports = router;