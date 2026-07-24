const usuarioModel = require('../models/usuarioModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // ¡En producción, usa una variable de entorno!

const login = async (req, res) => {
  const { email, password_hash } = req.body;

  try {
    const usuario = await usuarioModel.buscarPorEmail(email);

    if (!usuario || usuario.password_hash !== password_hash) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token: token,
      user: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const registrar = async (req, res) => {
  try {
    const existe = await usuarioModel.buscarPorEmail(req.body.email);
    if (existe) return res.status(400).json({ message: 'Email en uso.' });

    const nuevoUsuario = await usuarioModel.crearUsuario(req.body);
    res.status(201).json({ message: 'Registrado con éxito', data: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await usuarioModel.buscarPorId(req.user.id);
    if (!usuario) return res.status(404).json({ message: 'No encontrado.' });
    res.json({ data: usuario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login, registrar, obtenerPerfil };