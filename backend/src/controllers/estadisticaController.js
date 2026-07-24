const estadisticaModel = require('../models/estadisticaModel');

const verReporteGlobal = async (req, res) => {
  try {
    const reporte = await estadisticaModel.obtenerMetricasAutolavado();
    res.status(200).json({ data: reporte });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verReporteCliente = async (req, res) => {
  const clienteLogueadoId = req.user.id;
  const rol = req.user.rol;
  
  const { id } = req.params; 

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