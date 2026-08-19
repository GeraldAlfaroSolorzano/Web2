export function verificarSesion(req, res, next) {
    if (!req.session.usuario) {
        return res.status(401).json({
            exito: false,
            mensaje: 'Debe iniciar sesion para acceder a esta ruta'
        });
    }

    next();
}