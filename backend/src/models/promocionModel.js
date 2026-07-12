const pool = require('../config/db');

// Ajustado a tus columnas exactas
const crearPromocion = async (codigo, porcentaje_descuento, fecha_inicio, fecha_fin) => {
  const query = `
    INSERT INTO promociones (codigo, porcentaje_descuento, fecha_inicio, fecha_fin, esta_activa)
    VALUES ($1, $2, $3, $4, true)
    RETURNING *;
  `;
  const values = [codigo, porcentaje_descuento, fecha_inicio, fecha_fin];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const buscarPromocion = async (codigo) => {
  const query = `
    SELECT porcentaje_descuento FROM promociones 
    WHERE codigo = $1 AND esta_activa = true 
    AND CURRENT_DATE BETWEEN fecha_inicio AND fecha_fin`;
  const result = await pool.query(query, [codigo]);
  return result.rows[0];
};

const obtenerPromosActivas = async () => {
  const query = `
    SELECT codigo, porcentaje_descuento, fecha_fin 
    FROM promociones 
    WHERE esta_activa = true AND CURRENT_DATE <= fecha_fin
    ORDER BY fecha_fin ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

module.exports = { crearPromocion, buscarPromocion, obtenerPromosActivas };