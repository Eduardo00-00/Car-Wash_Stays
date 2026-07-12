const { Pool } = require('pg');
require('dotenv').config(); // Esto lee tu archivo .env

// Configuramos la conexión con las variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Probamos la conexión
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectar a PostgreSQL:', err.stack);
  } else {
    console.log('Conexión a PostgreSQL exitosa. Base de datos lista.');
  }
});

module.exports = pool;