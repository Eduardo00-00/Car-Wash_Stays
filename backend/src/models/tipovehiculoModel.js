const pool = require('../config/db');

const crearTipoVehiculo = async (nombre) => {
  const query = 'INSERT INTO tipos_vehiculo (nombre_tipo) VALUES ($1) RETURNING *;';
  const result = await pool.query(query, [nombre]);
  return result.rows[0];
};

// Nueva función para listar
const obtenerTodosLosTipos = async () => {
  const query = 'SELECT id, nombre_tipo FROM tipos_vehiculo ORDER BY id ASC;';
  const result = await pool.query(query);
  return result.rows;
};

module.exports = { crearTipoVehiculo, obtenerTodosLosTipos };