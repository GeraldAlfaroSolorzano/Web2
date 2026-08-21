import { Router } from 'express';

import {
    listarEquipos,
    consultarEquipo,
    registrarEquipo,
    modificarEquipo,
    cambiarEstado,
    removerEquipo
} from '../controllers/equipos.controller.js';

import {
    subirImagenEquipo,
    validarImagenRequerida,
    validarEquipo,
    validarEquipoId,
    validarEstadoEquipo
} from '../middlewares/equipos.middleware.js';

import {
    verificarSesion
} from '../middlewares/sesion.middleware.js';

import {
    verificarAdministrador
} from '../middlewares/rol.middleware.js';


const router = Router();


router.get(
    '/',
    verificarSesion,
    verificarAdministrador,
    listarEquipos
);


router.get(
    '/:id',
    verificarSesion,
    verificarAdministrador,
    validarEquipoId,
    consultarEquipo
);


router.post(
    '/',
    verificarSesion,
    verificarAdministrador,
    subirImagenEquipo,
    validarImagenRequerida,
    validarEquipo,
    registrarEquipo
);


router.put(
    '/:id',
    verificarSesion,
    verificarAdministrador,
    subirImagenEquipo,
    validarEquipoId,
    validarEquipo,
    modificarEquipo
);


router.put(
    '/:id/estado',
    verificarSesion,
    verificarAdministrador,
    validarEstadoEquipo,
    cambiarEstado
);


router.delete(
    '/:id',
    verificarSesion,
    verificarAdministrador,
    validarEquipoId,
    removerEquipo
);


export default router;