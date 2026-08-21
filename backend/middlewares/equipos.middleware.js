import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

import {
    body,
    param,
    validationResult
} from 'express-validator';


const carpetaEquipos = path.join(
    process.cwd(),
    'uploads',
    'equipos'
);


if (!fs.existsSync(carpetaEquipos)) {
    fs.mkdirSync(
        carpetaEquipos,
        {
            recursive: true
        }
    );
}


function eliminarArchivoSubido(archivo) {
    if (!archivo) {
        return;
    }

    if (fs.existsSync(archivo.path)) {
        fs.unlinkSync(
            archivo.path
        );
    }
}


const almacenamiento = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(
            null,
            carpetaEquipos
        );
    },

    filename: function (req, file, cb) {
        const extension = path
            .extname(file.originalname)
            .toLowerCase();

        const nombreSeguro =
            `${crypto.randomUUID()}${extension}`;

        cb(
            null,
            nombreSeguro
        );
    }
});


function validarTipoArchivo(req, file, cb) {
    const tiposPermitidos = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    const extensionesPermitidas = [
        '.jpg',
        '.jpeg',
        '.png',
        '.webp'
    ];

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    if (!tiposPermitidos.includes(file.mimetype)) {
        return cb(
            new Error(
                'El tipo de archivo no esta permitido'
            )
        );
    }

    if (!extensionesPermitidas.includes(extension)) {
        return cb(
            new Error(
                'La extension del archivo no esta permitida'
            )
        );
    }

    cb(
        null,
        true
    );
}


const upload = multer({
    storage: almacenamiento,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: validarTipoArchivo
});


export function subirImagenEquipo(req, res, next) {
    const subir = upload.single('imagen');

    subir(req, res, function (error) {
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'La imagen no puede superar 5 MB'
                });
            }

            if (error.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El campo de la imagen debe llamarse imagen'
                });
            }

            return res.status(400).json({
                exito: false,
                mensaje: `Error al cargar la imagen: ${error.code}`
            });
        }

        if (error) {
            return res.status(400).json({
                exito: false,
                mensaje: error.message
            });
        }

        next();
    });
}


export function validarImagenRequerida(req, res, next) {
    if (!req.file) {
        return res.status(400).json({
            exito: false,
            mensaje: 'La imagen del equipo es requerida'
        });
    }

    next();
}


export function validarErroresEquipo(req, res, next) {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        eliminarArchivoSubido(
            req.file
        );

        return res.status(400).json({
            exito: false,
            mensaje: 'Los datos enviados no son validos',
            errores: errores.array()
        });
    }

    next();
}


export const validarEquipo = [
    body('codigo')
        .trim()
        .notEmpty()
        .withMessage(
            'El codigo del equipo es requerido'
        )
        .isLength({ max: 50 })
        .withMessage(
            'El codigo no puede superar 50 caracteres'
        ),

    body('descripcion')
        .trim()
        .notEmpty()
        .withMessage(
            'La descripcion del equipo es requerida'
        )
        .isLength({ max: 255 })
        .withMessage(
            'La descripcion no puede superar 255 caracteres'
        ),

    body('estado')
        .trim()
        .notEmpty()
        .withMessage(
            'El estado del equipo es requerido'
        )
        .isIn([
            'DISPONIBLE',
            'MANTENIMIENTO',
            'INACTIVO'
        ])
        .withMessage(
            'El estado del equipo no es valido'
        ),

    validarErroresEquipo
];


export const validarEquipoId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage(
            'El id del equipo no es valido'
        ),

    validarErroresEquipo
];


export const validarEstadoEquipo = [
    param('id')
        .isInt({ min: 1 })
        .withMessage(
            'El id del equipo no es valido'
        ),

    body('estado')
        .trim()
        .notEmpty()
        .withMessage(
            'El estado del equipo es requerido'
        )
        .isIn([
            'DISPONIBLE',
            'MANTENIMIENTO',
            'INACTIVO'
        ])
        .withMessage(
            'El estado del equipo no es valido'
        ),

    validarErroresEquipo
];