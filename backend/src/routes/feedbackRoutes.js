const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const verificarToken = require('../middleware/authMiddleware');
const verificarRol = require('../middleware/roleMiddleware');

// Ruta para registrar (Solo clientes)
router.post('/resena', verificarToken, verificarRol(['cliente']), feedbackController.registrarFeedback);

// NUEVA RUTA: Obtener reseñas (Tanto admin como cliente pueden entrar)
router.get('/resenas', verificarToken, verificarRol(['admin', 'cliente']), feedbackController.obtenerFeedbacks);

module.exports = router;