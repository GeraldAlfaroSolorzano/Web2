import {
    param,
    query,
    validationResult
} from 'express-validator';

export function validarErroresReporte(
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

export const validarFiltrosReporte = [
    query('usuario')
        .optional()
        .trim()
        .isLength({ max: 150 })
        .withMessage(
            'El filtro de usuario no puede superar 150 caracteres'
        ),

    query('anio')
        .optional()
        .isInt({
            min: 2000,
            max: 2100
        })
        .withMessage(
            'El anio no es valido'
        ),

    query('mes')
        .optional()
        .isInt({
            min: 1,
            max: 12
        })
        .withMessage(
            'El mes no es valido'
        ),

    query('dia')
        .optional()
        .isInt({
            min: 1,
            max: 31
        })
        .withMessage(
            'El dia no es valido'
        ),

    query('departamento_id')
        .optional()
        .isInt({
            min: 1
        })
        .withMessage(
            'El departamento no es valido'
        ),

    validarErroresReporte
];

export const validarFormatoExportacion = [
    param('formato')
        .isIn([
            'json',
            'xml'
        ])
        .withMessage(
            'El formato de exportacion no es valido'
        ),

    validarErroresReporte
];