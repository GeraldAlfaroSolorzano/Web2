import {
    body,
    validationResult
} from 'express-validator';

export function validarErroresAuth(req, res, next) {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            exito: false,
            mensaje: 'Los datos enviados no son validos',
            errores: errores.array()
        });
    }

    next();
}

export const validarLogin = [
    body('usuario_o_correo')
        .trim()
        .notEmpty()
        .withMessage(
            'El usuario o correo es requerido'
        )
        .isLength({ max: 150 })
        .withMessage(
            'El usuario o correo no puede superar 150 caracteres'
        ),

    body('contrasena')
        .notEmpty()
        .withMessage(
            'La contrasena es requerida'
        ),

    validarErroresAuth
];

export const validarSolicitudRecuperacion = [
    body('usuario_o_correo')
        .trim()
        .notEmpty()
        .withMessage(
            'El usuario o correo es requerido'
        )
        .isLength({ max: 150 })
        .withMessage(
            'El usuario o correo no puede superar 150 caracteres'
        ),

    validarErroresAuth
];

export const validarRestablecerContrasena = [
    body('token')
        .trim()
        .notEmpty()
        .withMessage(
            'El token de recuperacion es requerido'
        )
        .isLength({ max: 255 })
        .withMessage(
            'El token de recuperacion no es valido'
        ),

    body('nueva_contrasena')
        .notEmpty()
        .withMessage(
            'La nueva contrasena es requerida'
        )
        .isLength({ min: 8 })
        .withMessage(
            'La nueva contrasena debe tener al menos 8 caracteres'
        )
        .matches(/[A-Z]/)
        .withMessage(
            'La nueva contrasena debe contener al menos una mayuscula'
        )
        .matches(/[0-9]/)
        .withMessage(
            'La nueva contrasena debe contener al menos un numero'
        )
        .matches(/[^A-Za-z0-9]/)
        .withMessage(
            'La nueva contrasena debe contener al menos un simbolo'
        ),

    body('confirmar_nueva_contrasena')
        .notEmpty()
        .withMessage(
            'La confirmacion de la nueva contrasena es requerida'
        )
        .custom((valor, { req }) => {
            if (valor !== req.body.nueva_contrasena) {
                throw new Error(
                    'Las nuevas contrasenas no coinciden'
                );
            }

            return true;
        }),

    validarErroresAuth
];