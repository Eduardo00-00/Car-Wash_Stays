const pool = require('../config/db');

const asignarPreciosMatriz = async (paquete_id, precios) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN'); // Iniciamos transacción
    
    // Opcional: Borramos los precios anteriores de este paquete por si es una actualización
    await client.query('DELETE FROM precios_paquetes WHERE paquete_id = $1', [paquete_id]);

    const queryInsert = `
      INSERT INTO precios_paquetes (paquete_id, tipo_id, precio) 
      VALUES ($1, $2, $3) RETURNING *;
    `;
    
    const resultados = [];
    
    // Insertamos cada precio que venga en el array
    for (let item of precios) {
      const res = await client.query(queryInsert, [paquete_id, item.tipo_id, item.precio]);
      resultados.push(res.rows[0]);
    }

    await client.query('COMMIT'); // Guardamos cambios
    return resultados;
  } catch (error) {
    await client.query('ROLLBACK'); // Si hay error, deshacemos todo
    throw error;
  } finally {
    client.release();
  }
};


const obtenerPreciosPorPaquete = async (paquete_id) => {
  // Asegúrate de que 'pp' y 'tv' coincidan con los nombres de tus tablas
  const query = `
    SELECT pp.id, pp.paquete_id, pp.tipo_id, tv.nombre_tipo AS tipo_vehiculo, pp.precio
    FROM precios_paquetes pp
    JOIN tipos_vehiculo tv ON pp.tipo_id = tv.id
    WHERE pp.paquete_id = $1;
  `;
  const result = await pool.query(query, [paquete_id]);
  return result.rows;
};

// ACUÉRDATE DE EXPORTARLA AL FINAL
module.exports = { 
  asignarPreciosMatriz, 
  obtenerPreciosPorPaquete 
};