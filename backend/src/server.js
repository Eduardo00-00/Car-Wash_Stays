const express = require('express');
const pool = require('./config/db.js'); 
require('dotenv').config();

// 1. IMPORTAR LAS RUTAS
const authRoutes = require('./routes/authRoutes'); // <--- NUEVA
const usuarioRoutes = require('./routes/usuarioRoutes');
const tipovehiculoRoutes = require('./routes/tipovehiculoRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes'); 
const paqueteRoutes = require('./routes/paqueteRoutes');
const servicioRoutes = require('./routes/servicioRoutes'); 
const pagoRoutes = require('./routes/pagoRoutes'); 
const feedbackRoutes = require('./routes/feedbackRoutes');
const estadisticaRoutes = require('./routes/estadisticaRoutes');
const notificacionesRoutes = require('./routes/notificacionRoutes');
const promocionesRoutes = require('./routes/promocionRoutes');
const preciopaqueteRoutes = require('./routes/preciopaqueteRoutes');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 2. MONTAR LAS RUTAS
app.use('/api/auth', authRoutes);            
app.use('/api/usuarios', usuarioRoutes);     
app.use('/api/tipos-vehiculo', tipovehiculoRoutes);
app.use('/api/vehiculos', vehiculoRoutes); 
app.use('/api/paquetes', paqueteRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/estadisticas', estadisticaRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/promociones', promocionesRoutes);
app.use('/api/preciopaquete', preciopaqueteRoutes)


app.get('/', (req, res) => {
  res.send('¡Servidor de Car-Wash Stays corriendo con seguridad JWT!');
});

app.listen(PORT, () => {
  console.log(`\n Servidor corriendo, rutas de autenticación montadas en /api/auth`);
});