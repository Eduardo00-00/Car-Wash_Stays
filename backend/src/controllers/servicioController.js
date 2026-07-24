const servicioModel = require('../models/servicioModel');
const vehiculoModel = require('../models/vehiculoModel'); 
const pool = require('../config/db');

// 1. CONTROLADOR PARA AGENDAR UN SERVICIO NUEVO
const agendarServicio = async (req, res) => {
  // Obtenemos el cliente_id directamente del token de sesión (Seguridad JWT)
  const cliente_id = req.user.id; 
  
  const { lavador_id, vehiculo_placa, paquete_id, estado } = req.body;

  if (!vehiculo_placa || !paquete_id) {
    return res.status(400).json({ message: 'Faltan campos obligatorios: vehiculo_placa o paquete_id.' });
  }

  try {
    // CANDADO 1: Validar que el vehículo pertenece al usuario del token
    const vehiculosDelCliente = await vehiculoModel.buscarPorClienteId(cliente_id);
    const vehiculoEncontrado = vehiculosDelCliente.find(
      v => v.placa.toUpperCase() === vehiculo_placa.toUpperCase().trim()
    );

    if (!vehiculoEncontrado) {
      return res.status(403).json({ 
        message: `Acceso denegado: El vehículo con placa [${vehiculo_placa}] no pertenece a tu cuenta.` 
      });
    }

    // CANDADO 2: Lógica de la Matriz de Precios (Validación de tipo de vehículo)
    const queryPrecio = 'SELECT precio FROM precios_paquetes WHERE paquete_id = $1 AND tipo_id = $2';
    const resPrecio = await pool.query(queryPrecio, [paquete_id, vehiculoEncontrado.tipo_id]);

    if (resPrecio.rows.length === 0 || parseFloat(resPrecio.rows[0].precio) <= 0) {
      return res.status(400).json({ 
        message: 'Este paquete no está disponible para tu tipo de vehículo.' 
      });
    }

    const precioMatriz = parseFloat(resPrecio.rows[0].precio);

    // Creación del servicio en la BD
    const nuevoServicio = await servicioModel.crearServicio({
      cliente_id, 
      lavador_id: lavador_id || null,
      vehiculo_placa: vehiculo_placa.toUpperCase().trim(),
      paquete_id,
      estado: estado || 'pendiente',
      monto_total: precioMatriz,
      descuento_aplicado: false
    });

    // DISPARADOR AUTOMÁTICO: Notificación inicial de "Pendiente"
    await pool.query(
      'INSERT INTO notificaciones (cliente_id, servicio_id, mensaje) VALUES ($1, $2, $3)',
      [cliente_id, nuevoServicio.id, "Tu auto ha sido registrado y está en espera de ser lavado."]
    );
    
    res.status(201).json({ 
      message: '¡Servicio agendado con éxito!', 
      precio_cobrado: `$${precioMatriz}`, 
      data: nuevoServicio 
    });

  } catch (error) {
    console.error("Error en agendarServicio:", error);
    res.status(500).json({ message: 'Error interno al agendar el servicio.', error: error.message });
  }
};

// 2. CONTROLADOR PARA CAMBIAR EL ESTADO
const cambiarEstado = async (req, res) => {
  const { id } = req.params; 
  const { estado } = req.body; 

  const estadosValidos = ['pendiente', 'en_proceso', 'finalizado', 'cancelado'];

  if (!estado || !estadosValidos.includes(estado)) {
    return res.status(400).json({ 
      message: `Estado no válido. Usa: ${estadosValidos.join(', ')}` 
    });
  }

  try {
    const servicioActualizado = await servicioModel.actualizarEstadoServicio(id, estado);

    if (!servicioActualizado) {
      return res.status(404).json({ message: 'No se encontró el servicio.' });
    }

    // Generación de mensaje dinámico
    let mensaje = "";
    switch(estado) {
        case 'en_proceso': mensaje = "Tu coche ha entrado al área de lavado."; break;
        case 'finalizado': mensaje = "Tu coche ha finalizado su proceso de lavado."; break;
        case 'cancelado': mensaje = "El servicio de tu coche ha sido cancelado."; break;
        default: mensaje = "El estado de tu servicio ha cambiado a " + estado; break;
    }

    // Disparador de notificación
    await pool.query(
        'INSERT INTO notificaciones (cliente_id, servicio_id, mensaje) VALUES ($1, $2, $3)',
        [servicioActualizado.cliente_id, id, mensaje]
    );

    res.status(200).json({ 
      message: '¡Estado actualizado y notificación enviada!', 
      data: servicioActualizado 
    });
    
  } catch (error) {
    console.error("Error en cambiarEstado:", error);
    res.status(500).json({ error: error.message });
  }
};

const obtenerServicios = async (req, res) => {
  const { rol, id } = req.user; 

  try {
    let servicios = [];

    if (rol === 'cliente') {
      servicios = await servicioModel.obtenerServiciosPorCliente(id);
    } else if (rol === 'lavador') {
      servicios = await servicioModel.obtenerServiciosActivos();
    } else if (rol === 'admin') {
      servicios = await servicioModel.obtenerTodosLosServicios();
    }

    res.status(200).json({ 
      message: `Servicios obtenidos para perfil: ${rol}`,
      data: servicios 
    });
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    res.status(500).json({ message: 'Error al obtener los servicios.', error: error.message });
  }
};

module.exports = { 
  agendarServicio,
  cambiarEstado,
  obtenerServicios
};