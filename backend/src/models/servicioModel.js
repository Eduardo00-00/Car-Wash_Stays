const pool = require('../config/db');

const crearServicio = async (servicioData) => {
  const { cliente_id, lavador_id, vehiculo_placa, paquete_id, estado, monto_total, descuento_aplicado } = servicioData;
  
  // Query con las 7 columnas de entrada e incluyendo el 'estado'
  const query = `
    INSERT INTO servicios (cliente_id, lavador_id, vehiculo_placa, paquete_id, estado, monto_total, descuento_aplicado)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, cliente_id, lavador_id, vehiculo_placa, paquete_id, estado, monto_total, descuento_aplicado, fecha_creacion, fecha_inicio, fecha_finalizacion;
  `;
  
  const values = [cliente_id, lavador_id, vehiculo_placa, paquete_id, estado, monto_total, descuento_aplicado];
  
  const result = await pool.query(query, values);
  return result.rows[0];
};

const actualizarEstadoServicio = async (id, nuevoEstado) => {
  let query = `
    UPDATE servicios 
    SET estado = $1
  `;

  // Control de marcas de tiempo según el flujo del negocio
  if (nuevoEstado === 'en_proceso') {
    query += `, fecha_inicio = CURRENT_TIMESTAMP`;
  } else if (nuevoEstado === 'finalizado') {
    query += `, fecha_finalizacion = CURRENT_TIMESTAMP`;
  }

  query += `
    WHERE id = $2
    RETURNING id, cliente_id, lavador_id, vehiculo_placa, paquete_id, estado, monto_total, descuento_aplicado, fecha_creacion, fecha_inicio, fecha_finalizacion;
  `;

  const result = await pool.query(query, [nuevoEstado, id]);
  return result.rows[0];
};

// --- NUEVAS FUNCIONES PARA EL GET INTELIGENTE ---

const obtenerServiciosPorCliente = async (cliente_id) => {
  const query = `
    SELECT * FROM servicios 
    WHERE cliente_id = $1 
    ORDER BY fecha_creacion DESC; 
  `;
  const result = await pool.query(query, [cliente_id]);
  return result.rows;
};

const obtenerServiciosActivos = async () => {
  const query = `
    SELECT * FROM servicios 
    WHERE estado IN ('pendiente', 'en_proceso') 
    ORDER BY fecha_creacion ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

const obtenerTodosLosServicios = async () => {
  const query = `
    SELECT * FROM servicios 
    ORDER BY fecha_creacion DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

module.exports = { 
  crearServicio,
  actualizarEstadoServicio,
  obtenerServiciosPorCliente,
  obtenerServiciosActivos,
  obtenerTodosLosServicios
};