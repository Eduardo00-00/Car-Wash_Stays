const estadisticaModel = require('../models/estadisticaModel');

// Controlador para el Administrador / Dueño
const verReporteGlobal = async (req, res) => {
  try {
    const reporte = await estadisticaModel.obtenerMetricasAutolavado();
    res.status(200).json({ data: reporte });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para el perfil del Cliente
const verReporteCliente = async (req, res) => {
  // Obtenemos el ID del cliente logueado desde el token
  const clienteLogueadoId = req.user.id;
  const rol = req.user.rol;
  
  // El ID que viene en la URL (parámetro)
  const { id } = req.params; 

  // SEGURIDAD: Si no es admin, solo puede ver sus propios datos
  if (rol !== 'admin' && parseInt(id) !== clienteLogueadoId) {
    return res.status(403).json({ message: "No tienes permiso para ver estadísticas ajenas." });
  }

  try {
    const reporteCliente = await estadisticaModel.obtenerMetricasPorCliente(id);
    res.status(200).json({ data: reporteCliente });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  verReporteGlobal,
  verReporteCliente
};