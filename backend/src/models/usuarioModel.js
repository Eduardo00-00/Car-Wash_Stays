const pool = require('../config/db');

const buscarPorEmail = async (email) => {
  const query = 'SELECT * FROM usuarios WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0]; 
};

const crearUsuario = async (usuarioData) => {
  const { nombre, email, password_hash, telefono, rol } = usuarioData;
  const query = `
    INSERT INTO usuarios (nombre, email, password_hash, telefono, rol)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, nombre, email, rol
  `;
  const values = [nombre, email, password_hash, telefono, rol || 'cliente'];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const buscarPorId = async (id) => {
  const query = 'SELECT id, nombre, email, telefono, rol FROM usuarios WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = { buscarPorEmail, crearUsuario, buscarPorId };