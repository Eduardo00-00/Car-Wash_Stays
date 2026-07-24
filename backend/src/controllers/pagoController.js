const pagoModel = require('../models/pagoModel');
const pool = require('../config/db');

// Registrar el pago de un servicio
// Registrar el pago de un servicio
const procesarPago = async (req, res) => {
  const { servicio_id, metodo, monto_pagado } = req.body;
  const { rol, id: usuario_id } = req.user; 

  if (!servicio_id || !metodo || monto_pagado === undefined) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  if (parseFloat(monto_pagado) <= 0) {
    return res.status(400).json({ message: 'El monto pagado debe ser mayor a 0.' });
  }

  const metodosValidos = ['efectivo', 'transferencia', 'terminal'];
  if (!metodosValidos.includes(metodo)) {
    return res.status(400).json({ message: `Método no válido.` });
  }

  try {
    const servicio = await pagoModel.obtenerServicioPorId(servicio_id);
    if (!servicio) {
      return res.status(404).json({ message: 'El servicio especificado no existe.' });
    }

    if (rol === 'cliente' && servicio.cliente_id !== usuario_id) {
      return res.status(403).json({ message: 'Acceso denegado.' });
    }

    // --- CANDADO ANTI-SOBREPAGOS ---
    const totalPagadoHistorico = await pagoModel.obtenerTotalPagado(servicio_id);
    const montoTotalServicio = parseFloat(servicio.monto_total);

    // Si el servicio ya está pagado en su totalidad, rebotamos la petición inmediatamente
    if (totalPagadoHistorico >= montoTotalServicio) {
      return res.status(400).json({ 
        message: 'Transacción rechazada: Este servicio ya ha sido liquidado en su totalidad. No se aceptan más abonos.' 
      });
    }

    // --- LÓGICA MATEMÁTICA ---
    const montoActual = parseFloat(monto_pagado);

    // Sumamos lo que ya había pagado antes + lo que está pagando ahorita
    const nuevoTotalAcumulado = totalPagadoHistorico + montoActual;
    
    // Calculamos cuánto falta
    let saldoRestante = montoTotalServicio - nuevoTotalAcumulado;
    if (saldoRestante < 0) saldoRestante = 0; 

    // Definimos el estado basado en si la suma alcanza el costo total
    const estaSaldado = nuevoTotalAcumulado >= montoTotalServicio;
    const estadoPagoTexto = estaSaldado ? 'completado' : 'pendiente';

    // --- GUARDADO EN BASE DE DATOS ---
    const nuevoPago = await pagoModel.registrarPago({
      servicio_id,
      metodo,
      monto_pagado: montoActual,
      estado: estadoPagoTexto // <--- Enviamos 'pendiente' o 'completado'
    });

    // --- NOTIFICACIÓN AUTOMÁTICA ---
    await pool.query(
      'INSERT INTO notificaciones (cliente_id, servicio_id, mensaje) VALUES ($1, $2, $3)',
      [
        servicio.cliente_id, 
        servicio_id, 
        `¡Pago registrado! Recibido: $${montoActual} mediante ${metodo}. ${estaSaldado ? 'Servicio liquidado por completo.' : `Aún faltan $${saldoRestante} por cubrir.`}`
      ]
    );

    // --- RESPUESTA AL FRONTEND / CLIENTE ---
    res.status(201).json({ 
      message: estaSaldado ? '¡Pago registrado! El servicio ha sido liquidado.' : 'Abono registrado. Aún falta dinero para liquidar el servicio.', 
      estado_pago: estadoPagoTexto,
      monto_total_servicio: montoTotalServicio,
      total_pagado_acumulado: nuevoTotalAcumulado,
      saldo_restante: saldoRestante,
      data: nuevoPago 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el pago.', error: error.message });
  }
};

// Obtener el historial de pagos de un servicio
const listarPagosServicio = async (req, res) => {
  const { servicio_id } = req.params;
  const { rol, id: usuario_id } = req.user;

  try {
    const servicio = await pagoModel.obtenerServicioPorId(servicio_id);
    if (!servicio) {
      return res.status(404).json({ message: 'El servicio especificado no existe.' });
    }

    if (rol === 'cliente' && servicio.cliente_id !== usuario_id) {
      return res.status(403).json({ message: 'Acceso denegado: No tienes permiso para ver los pagos de este servicio.' });
    }

    const pagos = await pagoModel.obtenerPagosPorServicio(servicio_id);
    const totalPagado = await pagoModel.obtenerTotalPagado(servicio_id);
    const montoTotalServicio = parseFloat(servicio.monto_total);

    // Misma lógica para la consulta general
    let saldoRestante = montoTotalServicio - totalPagado;
    if (saldoRestante < 0) saldoRestante = 0;
    const estaSaldado = totalPagado >= montoTotalServicio;

    res.status(200).json({ 
      estado_pago: estaSaldado ? 'completado' : 'pendiente',
      monto_total_servicio: montoTotalServicio,
      total_pagado_acumulado: totalPagado,
      saldo_restante: saldoRestante,
      data: pagos 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  procesarPago,
  listarPagosServicio
};