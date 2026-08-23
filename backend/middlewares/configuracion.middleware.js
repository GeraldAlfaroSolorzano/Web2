import {
    body,
    validationResult
} from 'express-validator';

export function validarErroresConfiguracion(
    req,
    res,
    next
) {
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

export const validarConfiguracion = [
    body('nombre_institucion')
        .trim()
        .notEmpty()
        .withMessage(
            'El nombre de la institucion es requerido'
        )
        .isLength({ max: 150 })
        .withMessage(
            'El nombre de la institucion no puede superar 150 caracteres'
        ),

    body('rango_ip_inicio')
        .trim()
        .notEmpty()
        .withMessage(
            'La IP inicial es requerida'
        )
        .isIP()
        .withMessage(
            'La IP inicial no es valida'
        ),

    body('rango_ip_fin')
        .trim()
        .notEmpty()
        .withMessage(
            'La IP final es requerida'
        )
        .isIP()
        .withMessage(
            'La IP final no es valida'
        ),

    body('tiempo_maximo_sesion')
        .notEmpty()
        .withMessage(
            'El tiempo maximo de sesion es requerido'
        )
        .isInt({ min: 1 })
        .withMessage(
            'El tiempo maximo de sesion debe ser mayor a 0'
        ),

    body('tamano_maximo_archivo')
        .notEmpty()
        .withMessage(
            'El tamano maximo de archivo es requerido'
        )
        .isInt({ min: 1 })
        .withMessage(
            'El tamano maximo de archivo debe ser mayor a 0'
        ),

    validarErroresConfiguracion
];