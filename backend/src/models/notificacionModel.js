const pool = require('../config/db');

const guardarNotificacion = async (cliente_id, mensaje) => {
  await pool.query(
    'INSERT INTO notificaciones (cliente_id, mensaje) VALUES ($1, $2)',
    [cliente_id, mensaje]
  );
};

module.exports = { guardarNotificacion };