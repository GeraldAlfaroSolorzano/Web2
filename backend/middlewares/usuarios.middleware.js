import {
    body,
    validationResult
} from 'express-validator';

export function validarErroresUsuario(req, res, next) {
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

export const validarRegistroUsuario = [
    body('nombre_completo')
        .trim()
        .notEmpty()
        .withMessage('El nombre completo es requerido')
        .isLength({ max: 150 })
        .withMessage(
            'El nombre completo no puede superar 150 caracteres'
        ),

    body('fecha_nacimiento')
        .notEmpty()
        .withMessage('La fecha de nacimiento es requerida')
        .isDate()
        .withMessage('La fecha de nacimiento no es valida'),

    body('correo')
        .trim()
        .notEmpty()
        .withMessage('El correo es requerido')
        .isEmail()
        .withMessage('El correo no es valido')
        .isLength({ max: 150 })
        .withMessage(
            'El correo no puede superar 150 caracteres'
        ),

    body('departamento_id')
        .notEmpty()
        .withMessage('El departamento es requerido')
        .isInt({ min: 1 })
        .withMessage('El departamento no es valido'),

    body('nombre_usuario')
        .trim()
        .notEmpty()
        .withMessage('El nombre de usuario es requerido')
        .isLength({ max: 80 })
        .withMessage(
            'El nombre de usuario no puede superar 80 caracteres'
        ),

    body('contrasena')
        .notEmpty()
        .withMessage('La contrasena es requerida')
        .isLength({ min: 8 })
        .withMessage(
            'La contrasena debe tener al menos 8 caracteres'
        )
        .matches(/[A-Z]/)
        .withMessage(
            'La contrasena debe contener al menos una mayuscula'
        )
        .matches(/[0-9]/)
        .withMessage(
            'La contrasena debe contener al menos un numero'
        )
        .matches(/[^A-Za-z0-9]/)
        .withMessage(
            'La contrasena debe contener al menos un simbolo'
        ),

    body('confirmar_contrasena')
        .notEmpty()
        .withMessage(
            'La confirmacion de contrasena es requerida'
        )
        .custom((valor, { req }) => {
            if (valor !== req.body.contrasena) {
                throw new Error(
                    'Las contrasenas no coinciden'
                );
            }

            return true;
        }),

    validarErroresUsuario
];

export const validarActualizacionPerfil = [
    body('nombre_completo')
        .trim()
        .notEmpty()
        .withMessage('El nombre completo es requerido')
        .isLength({ max: 150 })
        .withMessage(
            'El nombre completo no puede superar 150 caracteres'
        ),

    body('fecha_nacimiento')
        .notEmpty()
        .withMessage('La fecha de nacimiento es requerida')
        .isDate()
        .withMessage('La fecha de nacimiento no es valida'),

    body('departamento_id')
        .notEmpty()
        .withMessage('El departamento es requerido')
        .isInt({ min: 1 })
        .withMessage('El departamento no es valido'),

    validarErroresUsuario
];

export const validarCambioContrasena = [
    body('contrasena_actual')
        .notEmpty()
        .withMessage('La contrasena actual es requerida'),

    body('nueva_contrasena')
        .notEmpty()
        .withMessage('La nueva contrasena es requerida')
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

    validarErroresUsuario
];