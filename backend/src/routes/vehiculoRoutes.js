const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');
const verificarToken = require('../middleware/authMiddleware');
const verificarRol = require('../middleware/roleMiddleware'); // ¡Importante!

router.post('/registrar', verificarToken, verificarRol(['cliente']), vehiculoController.registrarVehiculo);
router.get('/mis-vehiculos', verificarToken, verificarRol(['cliente']), vehiculoController.obtenerVehiculosCliente);
router.patch('/actualizar/:placa', verificarToken, verificarRol(['cliente']), vehiculoController.actualizarVehiculo);
router.delete('/eliminar/:placa', verificarToken, verificarRol(['cliente']), vehiculoController.eliminarVehiculo);

router.get('/tipos', verificarToken, verificarRol(['admin', 'lavador', 'cliente']), vehiculoController.obtenerTodosLosTipos);

module.exports = router;