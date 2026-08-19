import { Router } from 'express';

import {
    listarDepartamentos,
    consultarDepartamento,
    registrarDepartamento,
    modificarDepartamento,
    removerDepartamento
} from '../controllers/departamentos.controller.js';

import {
    validarDepartamento,
    validarDepartamentoId
} from '../middlewares/departamentos.middleware.js';

import {
    verificarSesion
} from '../middlewares/sesion.middleware.js';

import {
    verificarAdministrador
} from '../middlewares/rol.middleware.js';

const router = Router();

router.get(
    '/',
    listarDepartamentos
);

router.get(
    '/:id',
    validarDepartamentoId,
    consultarDepartamento
);

router.post(
    '/',
    verificarSesion,
    verificarAdministrador,
    validarDepartamento,
    registrarDepartamento
);

router.put(
    '/:id',
    verificarSesion,
    verificarAdministrador,
    validarDepartamentoId,
    validarDepartamento,
    modificarDepartamento
);

router.delete(
    '/:id',
    verificarSesion,
    verificarAdministrador,
    validarDepartamentoId,
    removerDepartamento
);

export default router;