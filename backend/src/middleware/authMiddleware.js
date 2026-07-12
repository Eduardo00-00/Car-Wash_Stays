const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // 1. Validar que la variable exista antes de seguir
  if (!process.env.JWT_SECRET) {
    console.error("ERROR: JWT_SECRET no está definida en el .env");
    return res.status(500).json({ message: "Error de configuración del servidor" });
  }

  if (!authHeader) return res.status(403).json({ message: 'Token requerido.' });

  const token = authHeader.split(' ')[1];

  // 2. Usar la variable directamente
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token inválido.' });
    req.user = decoded; 
    next();
  });
};

module.exports = verificarToken;