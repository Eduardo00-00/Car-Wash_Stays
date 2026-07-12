const paqueteModel = require('../models/paqueteModel');

const registrarPaquete = async (req, res) => {
  const { nombre, descripcion, precio_base, duracion_minutos, activo } = req.body;

  if (!nombre || precio_base === undefined || !duracion_minutos) {
    return res.status(400).json({ message: 'Nombre, precio y tiempo estimado son obligatorios.' });
  }

  try {
    const nuevoPaquete = await paqueteModel.crearPaquete({
      nombre, descripcion, precio_base, duracion_minutos, activo
    });
    res.status(201).json({ message: ' Paquete creado en el catálogo', data: nuevoPaquete });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el paquete', error: error.message });
  }
};

const obtenerPaquetes = async (req, res) => {
  // Verificamos si el usuario es admin o cliente
  const esAdmin = req.user && req.user.rol === 'admin';
  
  try {
    // Si no es admin, solo traemos los activos
    const paquetes = await paqueteModel.obtenerTodosLosPaquetes(!esAdmin);
    res.status(200).json({ data: paquetes });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener paquetes', error: error.message });
  }
};

module.exports = { registrarPaquete, obtenerPaquetes };