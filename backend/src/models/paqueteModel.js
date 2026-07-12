const pool = require('../config/db');

const crearPaquete = async (paqueteData) => {
  const { nombre, descripcion, precio_base, duracion_minutos, activo } = paqueteData;
  const query = `
    INSERT INTO paquetes (nombre, descripcion, precio_base, duracion_minutos, activo)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, nombre, descripcion, precio_base, duracion_minutos, activo
  `;
  const values = [nombre, descripcion, precio_base, duracion_minutos, activo !== undefined ? activo : true];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const obtenerTodosLosPaquetes = async (soloActivos = false) => {
  let query = 'SELECT id, nombre, descripcion, precio_base, duracion_minutos, activo FROM paquetes';
  
  if (soloActivos) {
    query += ' WHERE activo = true';
  }
  
  query += ' ORDER BY precio_base ASC;';
  const result = await pool.query(query);
  return result.rows;
};

module.exports = { crearPaquete, obtenerTodosLosPaquetes };