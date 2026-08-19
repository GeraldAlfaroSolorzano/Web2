export function verificarAdministrador(req, res, next) {
    if (!req.session.usuario) {
        return res.status(401).json({
            exito: false,
            mensaje: 'Debe iniciar sesion para acceder a esta ruta'
        });
    }

    if (req.session.usuario.rol_id !== 2) {
        return res.status(403).json({
            exito: false,
            mensaje: 'No tiene permisos para realizar esta accion'
        });
    }

    next();
}