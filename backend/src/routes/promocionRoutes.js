const express = require('express');
const router = express.Router();
const promoController = require('../controllers/promocionController');
const verificarToken = require('../middleware/authMiddleware');
const verificarRol = require('../middleware/roleMiddleware');
// Rutas
router.post('/registrar', verificarToken, verificarRol(['admin']), promoController.registrarPromo);
router.post('/validar', verificarToken, verificarRol(['cliente']), promoController.validarPromo);
router.get('/', verificarToken, verificarRol(['admin', 'cliente']), promoController.obtenerTodasLasPromos);

module.exports = router;