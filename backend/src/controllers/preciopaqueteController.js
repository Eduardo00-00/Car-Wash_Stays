const precioPaqueteModel = require('../models/precioPaqueteModel');

const configurarPrecios = async (req, res) => {
  const { paquete_id, precios } = req.body;

  if (!paquete_id || !Array.isArray(precios) || precios.length === 0) {
    return res.status(400).json({ message: "Faltan datos. Se requiere paquete_id y un array de precios." });
  }

  try {
    const nuevosPrecios = await precioPaqueteModel.asignarPreciosMatriz(paquete_id, precios);
    res.status(201).json({ 
      message: "Matriz de precios configurada con éxito", 
      data: nuevosPrecios 
    });
  } catch (error) {
    console.error("Error al configurar precios:", error);
    res.status(500).json({ message: "Error interno al guardar los precios." });
  }
};


const obtenerPrecios = async (req, res) => {
  const { paquete_id } = req.params;

  try {
    const precios = await precioPaqueteModel.obtenerPreciosPorPaquete(paquete_id);
    res.status(200).json({
      success: true,
      data: precios
    });
  } catch (error) {
    console.error("Error al obtener los precios:", error);
    res.status(500).json({ message: "Error interno al recuperar la matriz de precios." });
  }
};

// ACUÉRDATE DE EXPORTARLA AL FINAL
module.exports = { 
  configurarPrecios, 
  obtenerPrecios 
};