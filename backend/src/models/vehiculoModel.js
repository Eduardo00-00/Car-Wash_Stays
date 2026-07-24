const pool = require('../config/db');

const crearVehiculo = async (vehiculoData) => {
  const { placa, marca, modelo, color, tipo_id, cliente_id } = vehiculoData;
  
  const query = `
    INSERT INTO vehiculos (placa, marca, modelo, color, tipo_id, cliente_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING placa, marca, modelo, color, tipo_id, cliente_id
  `;
  const values = [placa, marca, modelo, color, tipo_id, cliente_id];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const buscarPorClienteId = async (cliente_id) => {
  const query = `
    SELECT v.*, t.nombre_tipo 
    FROM vehiculos v
    JOIN tipos_vehiculo t ON v.tipo_id = t.id
    WHERE v.cliente_id = $1
  `;
  const result = await pool.query(query, [cliente_id]);
  return result.rows; 
};

const obtenerTiposVehiculo = async () => {
  const query = 'SELECT id, nombre_tipo FROM tipos_vehiculo ORDER BY nombre_tipo ASC';
  const result = await pool.query(query);
  return result.rows;
};

const actualizarVehiculo = async (placa_original, cliente_id, datos) => {
  const campos = [];
  const valores = [];
  let i = 1;

  for (const [key, value] of Object.entries(datos)) {
    if (['placa', 'marca', 'modelo', 'color', 'tipo_id'].includes(key)) {
      campos.push(`${key} = $${i}`);
      valores.push(value);
      i++;
    }
  }

  valores.push(placa_original, cliente_id);
  const query = `
    UPDATE vehiculos 
    SET ${campos.join(', ')}
    WHERE placa = $${i} AND cliente_id = $${i + 1}
    RETURNING *
  `;

  const result = await pool.query(query, valores);
  return result.rows[0];
};

const eliminarVehiculo = async (placa, cliente_id) => {
  const query = `
    DELETE FROM vehiculos 
    WHERE placa = $1 AND cliente_id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [placa, cliente_id]);
  return result.rows[0]; 
};


module.exports = { crearVehiculo, buscarPorClienteId, obtenerTiposVehiculo, actualizarVehiculo, eliminarVehiculo };
