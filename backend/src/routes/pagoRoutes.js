const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const verificarToken = require('../middleware/authMiddleware');
const verificarRol = require('../middleware/roleMiddleware');

// Registrar pago (Admin, Lavador y Cliente pueden registrar)
router.post('/registrar', 
  verificarToken, 
  verificarRol(['admin', 'lavador', 'cliente']), 
  pagoController.procesarPago
);

// Consultar el historial de pagos de un servicio especifico
router.get('/servicio/:servicio_id', 
  verificarToken, 
  verificarRol(['admin', 'lavador', 'cliente']), 
  pagoController.listarPagosServicio
);

module.exports = router;