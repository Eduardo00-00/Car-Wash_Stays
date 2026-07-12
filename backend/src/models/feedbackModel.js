const pool = require('../config/db');

// NUEVA FUNCIÓN: Verifica si el servicio le pertenece al cliente
const verificarPropiedadServicio = async (servicio_id, cliente_id) => {
  const query = `
    SELECT id 
    FROM servicios 
    WHERE id = $1 AND cliente_id = $2;
  `;
  const result = await pool.query(query, [servicio_id, cliente_id]);
  return result.rowCount > 0; 
};

const crearFeedback = async (feedbackData) => {
  const { servicio_id, calificacion, comentario, es_negativo } = feedbackData;

  const query = `
    INSERT INTO feedback (servicio_id, calificacion, comentario, es_negativo)
    VALUES ($1, $2, $3, $4)
    RETURNING id, servicio_id, calificacion, comentario, es_negativo, fecha_registro;
  `;

  const values = [servicio_id, calificacion, comentario, es_negativo];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const obtenerTodosLosFeedbacks = async (cliente_id = null) => {
  let query = `
    SELECT f.*, s.cliente_id 
    FROM feedback f
    JOIN servicios s ON f.servicio_id = s.id
  `;
  const values = [];

  if (cliente_id) {
    query += ` WHERE s.cliente_id = $1`;
    values.push(cliente_id);
  }

  query += ` ORDER BY f.fecha_registro DESC;`;
  const result = await pool.query(query, values);
  return result.rows;
};

module.exports = {
  verificarPropiedadServicio, // Agregada aquí
  crearFeedback,
  obtenerTodosLosFeedbacks
};