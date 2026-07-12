const pool = require('../config/db');


const obtenerNotificaciones = async (req, res) => {
  const cliente_id = req.user.id; 
  
  try {
    const query = `
      SELECT id, mensaje, leida, fecha_creacion 
      FROM notificaciones 
      WHERE cliente_id = $1 
      ORDER BY fecha_creacion DESC
    `;
    
    const result = await pool.query(query, [cliente_id]);
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({ success: false, message: "Error interno" });
  }
};


const marcarComoLeida = async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.query('UPDATE notificaciones SET leida = true WHERE id = $1', [id]);
    res.status(200).json({ success: true, message: "Notificación marcada como leída" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar notificación" });
  }
};

module.exports = { 
  obtenerNotificaciones,
  marcarComoLeida 
};