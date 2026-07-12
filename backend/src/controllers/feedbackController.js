const feedbackModel = require('../models/feedbackModel');

const registrarFeedback = async (req, res) => {
  const { servicio_id, calificacion, comentario } = req.body;
  const cliente_id = req.user.id; // Extraemos el ID desde el token

  if (!servicio_id || !calificacion) {
    return res.status(400).json({ message: 'El ID del servicio y la calificación son obligatorios.' });
  }

  try {
    // VALIDACIÓN DE SEGURIDAD: Evita que califiquen servicios ajenos
    const esDueno = await feedbackModel.verificarPropiedadServicio(servicio_id, cliente_id);
    
    if (!esDueno) {
      return res.status(403).json({ message: 'Acceso denegado: El servicio no existe o no te pertenece.' });
    }

    // Lógica automática: 1, 2 o 3 estrellas se considera feedback negativo (true)
    const es_negativo = calificacion <= 3;

    const nuevoFeedback = await feedbackModel.crearFeedback({
      servicio_id,
      calificacion,
      comentario: comentario || null,
      es_negativo
    });

    res.status(201).json({
      message: '¡Muchas gracias por tu opinión! Feedback registrado.',
      data: nuevoFeedback
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el feedback.', error: error.message });
  }
};

const obtenerFeedbacks = async (req, res) => {
  const { rol, id } = req.user;

  try {
    // Si es admin, no enviamos ID de cliente (obtiene todos)
    // Si es cliente, pasamos su ID para que solo obtenga lo suyo
    const cliente_id = (rol === 'admin') ? null : id;
    const feedbacks = await feedbackModel.obtenerTodosLosFeedbacks(cliente_id);
    
    res.status(200).json({ data: feedbacks });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener feedbacks.', error: error.message });
  }
};  

module.exports = {
  registrarFeedback,
  obtenerFeedbacks
};