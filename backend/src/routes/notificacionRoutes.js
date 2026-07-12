const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');
const verificarToken = require('../middleware/authMiddleware')

router.get('/mis-notificaciones', verificarToken, notificacionController.obtenerNotificaciones);
module.exports = router;