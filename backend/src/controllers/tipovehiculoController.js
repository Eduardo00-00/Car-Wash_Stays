const tipovehiculoModel = require('../models/tipovehiculoModel');

const registrarTipoVehiculo = async (req, res) => {
  const { nombre_tipo } = req.body;
  if (!nombre_tipo) return res.status(400).json({ message: 'El nombre es obligatorio.' });

  try {
    const nuevoTipo = await tipovehiculoModel.crearTipoVehiculo(nombre_tipo);
    res.status(201).json({ message: 'Añadido al catálogo!', data: nuevoTipo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Nuevo controlador para listar
const obtenerTipos = async (req, res) => {
  try {
    const tipos = await tipovehiculoModel.obtenerTodosLosTipos();
    res.status(200).json({ data: tipos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registrarTipoVehiculo, obtenerTipos };