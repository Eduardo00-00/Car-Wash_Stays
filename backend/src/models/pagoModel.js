const pool = require('../config/db');

// 1. Registrar un pago nuevo
const registrarPago = async (pagoData) => {
  const { servicio_id, metodo, monto_pagado } = pagoData;
  
  const query = `
    INSERT INTO pagos (servicio_id, metodo, monto_pagado)
    VALUES ($1, $2, $3)
    RETURNING id, servicio_id, metodo, monto_pagado, fecha_pago;
  `;
  
  const result = await pool.query(query, [servicio_id, metodo, monto_pagado]);
  return result.rows[0];
};

// 2. Obtener los pagos realizados a un servicio específico
const obtenerPagosPorServicio = async (servicio_id) => {
  const query = `
    SELECT * FROM pagos 
    WHERE servicio_id = $1 
    ORDER BY fecha_pago DESC;
  `;
  const result = await pool.query(query, [servicio_id]);
  return result.rows;
};

module.exports = {
  registrarPago,
  obtenerPagosPorServicio
};