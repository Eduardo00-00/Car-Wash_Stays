const pool = require('../config/db');

// 1. Obtener datos del servicio para validaciones (existencia, dueño y costo total)
const obtenerServicioPorId = async (servicio_id) => {
  const query = 'SELECT id, cliente_id, monto_total FROM servicios WHERE id = $1;';
  const result = await pool.query(query, [servicio_id]);
  return result.rows[0];
};

// 2. Obtener la suma total abonada/pagada hasta el momento para un servicio
const obtenerTotalPagado = async (servicio_id) => {
  const query = `
    SELECT COALESCE(SUM(monto_pagado), 0) as total_pagado 
    FROM pagos 
    WHERE servicio_id = $1;
  `;
  const result = await pool.query(query, [servicio_id]);
  return parseFloat(result.rows[0].total_pagado);
};

// 3. Registrar un pago nuevo
const registrarPago = async (pagoData) => {
  const { servicio_id, metodo, monto_pagado, estado } = pagoData;
  
  const query = `
    INSERT INTO pagos (servicio_id, metodo, monto_pagado, estado)
    VALUES ($1, $2, $3, $4)
    RETURNING id, servicio_id, metodo, monto_pagado, estado, fecha_pago;
  `;
  
  const result = await pool.query(query, [servicio_id, metodo, monto_pagado, estado]);
  return result.rows[0];
};

// 4. Obtener los pagos realizados a un servicio específico
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
  obtenerServicioPorId,
  obtenerTotalPagado,
  registrarPago,
  obtenerPagosPorServicio
};