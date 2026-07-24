const vehiculoModel = require('../models/vehiculoModel');

const registrarVehiculo = async (req, res) => {
  const { placa, marca, modelo, color, tipo_id } = req.body;
  const cliente_id = req.user.id; 

  if (!placa || !marca || !modelo || !tipo_id) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  try {
    const nuevoVehiculo = await vehiculoModel.crearVehiculo({
      placa, marca, modelo, color, tipo_id, cliente_id
    });

    res.status(201).json({
      message: '¡Vehículo registrado con éxito!',
      data: nuevoVehiculo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerVehiculosCliente = async (req, res) => {
  const cliente_id = req.user.id; 

  try {
    const listaVehiculos = await vehiculoModel.buscarPorClienteId(cliente_id);
    res.status(200).json({ data: listaVehiculos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerTodosLosTipos = async (req, res) => {
  try {
    const tipos = await vehiculoModel.obtenerTiposVehiculo();
    res.status(200).json({ data: tipos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarVehiculo = async (req, res) => {
  const placa_original = req.params.placa;
  const cliente_id = req.user.id;
  const datos = req.body;

  try {
    const vehiculoActualizado = await vehiculoModel.actualizarVehiculo(placa_original, cliente_id, datos);

    if (!vehiculoActualizado) {
      return res.status(404).json({ message: 'Vehículo no encontrado o no te pertenece.' });
    }

    res.status(200).json({ message: '¡Actualizado!', data: vehiculoActualizado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarVehiculo = async (req, res) => {
  const placa = req.params.placa;
  const cliente_id = req.user.id;

  try {
    const vehiculoEliminado = await vehiculoModel.eliminarVehiculo(placa, cliente_id);

    if (!vehiculoEliminado) {
      return res.status(404).json({ message: 'Vehículo no encontrado o no autorizado para borrar.' });
    }

    res.status(200).json({
      message: 'Vehículo eliminado con éxito.',
      data: vehiculoEliminado
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  registrarVehiculo,
  obtenerVehiculosCliente,
  obtenerTodosLosTipos,
  actualizarVehiculo,
  eliminarVehiculo
};
