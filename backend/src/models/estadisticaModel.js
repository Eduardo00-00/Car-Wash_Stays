const pool = require('../config/db');

const obtenerMetricasAutolavado = async () => {
  const query = 'SELECT * FROM vista_estadisticas_autolavado;';
  const result = await pool.query(query);
  return result.rows[0]; // Retorna una sola fila con los acumulados del negocio
};

const obtenerMetricasPorCliente = async (cliente_id) => {
  const query = 'SELECT * FROM vista_estadisticas_cliente WHERE cliente_id = $1;';
  const result = await pool.query(query, [cliente_id]);
  return result.rows[0] || { message: 'El cliente no registra servicios finalizados aún.' };
};

module.exports = {
  obtenerMetricasAutolavado,
  obtenerMetricasPorCliente
};