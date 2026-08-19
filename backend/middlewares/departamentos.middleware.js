import {
    body,
    param,
    validationResult
} from 'express-validator';

export function validarErroresDepartamento(
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

export const validarDepartamento = [
    body('nombre')
        .trim()
        .notEmpty()
        .withMessage(
            'El nombre del departamento es requerido'
        )
        .isLength({ max: 150 })
        .withMessage(
            'El nombre no puede superar 150 caracteres'
        ),

    body('descripcion')
        .optional({ nullable: true })
        .isLength({ max: 255 })
        .withMessage(
            'La descripcion no puede superar 255 caracteres'
        ),

    body('encargado')
        .optional({ nullable: true })
        .isLength({ max: 150 })
        .withMessage(
            'El encargado no puede superar 150 caracteres'
        ),

    validarErroresDepartamento
];

export const validarDepartamentoId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage(
            'El id del departamento no es valido'
        ),

    validarErroresDepartamento
];