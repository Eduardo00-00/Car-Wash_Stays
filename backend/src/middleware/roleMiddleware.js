const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    // 1. Verificamos que el usuario tenga un rol (esto viene de tu authMiddleware)
    if (!req.user || !req.user.rol) {
      return res.status(403).json({ message: "Acceso denegado: No se identificó el tipo de usuario." });
    }

    // 2. Comparamos si el rol del usuario está en la lista de permitidos
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ 
        message: `Acceso denegado: Se requiere uno de los siguientes roles: ${rolesPermitidos.join(', ')}` 
      });
    }

    // 3. ¡Si pasa, adelante!
    next();
  };
};

module.exports = verificarRol;