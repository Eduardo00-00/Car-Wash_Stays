const pagoModel = require('../models/pagoModel');

// Registrar el pago de un servicio
const procesarPago = async (req, res) => {
  const { servicio_id, metodo, monto_pagado } = req.body;

  // Validaciones obligatorias
  if (!servicio_id || !metodo || monto_pagado === undefined) {
    return res.status(400).json({ message: 'Faltan campos obligatorios (servicio_id, metodo, monto_pagado).' });
  }

  const metodosValidos = ['efectivo', 'transferencia', 'terminal'];
  if (!metodosValidos.includes(metodo)) {
    return res.status(400).json({ 
      message: `Método de pago no válido. Opciones permitidas: ${metodosValidos.join(', ')}` 
    });
  }

  try {
    const nuevoPago = await pagoModel.registrarPago({
      servicio_id,
      metodo,
      monto_pagado
    });

    res.status(201).json({ 
      message: ' ¡Pago registrado con éxito!', 
      data: nuevoPago 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al registrar el pago. Verifica que el servicio_id exista.', 
      error: error.message 
    });
  }
};

// Obtener el historial de pagos de un servicio
const listarPagosServicio = async (req, res) => {
  const { servicio_id } = req.params;

  try {
    const pagos = await pagoModel.obtenerPagosPorServicio(servicio_id);
    res.status(200).json({ data: pagos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  procesarPago,
  listarPagosServicio
};