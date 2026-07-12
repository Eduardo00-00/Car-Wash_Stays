const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

// Ruta para efectuar el pago de una lavada
router.post('/registrar', pagoController.procesarPago);

// Ruta para consultar los pagos de un servicio específico
router.get('/servicio/:servicio_id', pagoController.listarPagosServicio);

module.exports = router;