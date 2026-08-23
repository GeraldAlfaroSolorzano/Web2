import { Router } from 'express';

import {
    consultarConfiguracion,
    guardarConfiguracion
} from '../controllers/configuracion.controller.js';

import {
    validarConfiguracion
} from '../middlewares/configuracion.middleware.js';

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
    consultarConfiguracion
);

router.put(
    '/',
    verificarSesion,
    verificarAdministrador,
    validarConfiguracion,
    guardarConfiguracion
);

export default router;