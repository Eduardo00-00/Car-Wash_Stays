const pool = require('../config/db');

// 1. Obtener las métricas globales del negocio (Ingresos, promedio de calificación, métodos de pago)
const obtenerMetricasAutolavado = async () => {
  const query = 'SELECT * FROM vista_estadisticas_autolavado;';
  const result = await pool.query(query);
  return result.rows[0]; // Retorna una sola fila con los acumulados del negocio
};

// 2. Obtener el historial y estadísticas de un cliente específico (Cuántos servicios lleva, total gastado)
const obtenerMetricasPorCliente = async (cliente_id) => {
  const query = 'SELECT * FROM vista_estadisticas_cliente WHERE cliente_id = $1;';
  const result = await pool.query(query, [cliente_id]);
  return result.rows[0] || { message: 'El cliente no registra servicios finalizados aún.' };
};

module.exports = {
  obtenerMetricasAutolavado,
  obtenerMetricasPorCliente
};