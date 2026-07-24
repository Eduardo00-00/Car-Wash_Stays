const promocionModel = require('../models/promocionModel');

const registrarPromo = async (req, res) => {
  const { codigo, porcentaje_descuento, fecha_inicio, fecha_fin } = req.body;
  try {
    const nuevaPromo = await promocionModel.crearPromocion(codigo, porcentaje_descuento, fecha_inicio, fecha_fin);
    res.status(201).json({ message: "Promoción creada exitosamente", promocion: nuevaPromo });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar la promoción: " + error.message });
  }
};

const validarPromo = async (req, res) => {
  const { codigo } = req.body;
  try {
    const promo = await promocionModel.buscarPromocion(codigo);
    if (!promo) return res.status(404).json({ message: "Cupón no válido o expirado" });
    res.json({ descuento: promo.porcentaje_descuento });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerTodasLasPromos = async (req, res) => {
  try {
    const promos = await promocionModel.obtenerPromosActivas();
    res.status(200).json({ data: promos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registrarPromo, validarPromo, obtenerTodasLasPromos };