const express = require('express');
const router = express.Router();
const estadisticaController = require('../controllers/estadisticaController');
const verificarToken = require('../middleware/authMiddleware');
const verificarRol = require('../middleware/roleMiddleware');

// Ruta para ver las métricas del negocio
router.get('/global', verificarToken, verificarRol(['admin']), estadisticaController.verReporteGlobal);

// Ruta para ver las métricas de un cliente en específico (ej. /api/estadisticas/cliente/1)
router.get('/cliente/:id', verificarToken, verificarRol(['admin', 'cliente']), estadisticaController.verReporteCliente);

module.exports = router;