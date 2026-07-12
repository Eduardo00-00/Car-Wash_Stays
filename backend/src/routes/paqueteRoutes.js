const express = require('express');
const router = express.Router();
const paqueteController = require('../controllers/paqueteController');
const verificarToken = require('../middleware/authMiddleware');
const verificarRol = require('../middleware/roleMiddleware');


// Ruta para crear (Solo Admin)
router.post('/crear', verificarToken, verificarRol(['admin']), paqueteController.registrarPaquete);

// NUEVA RUTA: Listar paquetes (Admin, Cliente y Lavador pueden ver el catálogo)
router.get('/paquetes', verificarToken, verificarRol(['admin', 'cliente', 'lavador']), paqueteController.obtenerPaquetes);
module.exports = router;