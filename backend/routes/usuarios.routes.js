import { Router } from 'express';

import {
    registrarUsuario,
    consultarPerfil,
    modificarPerfil,
    cambiarContrasena
} from '../controllers/usuarios.controller.js';

import {
    validarRegistroUsuario,
    validarActualizacionPerfil,
    validarCambioContrasena
} from '../middlewares/usuarios.middleware.js';

import {
    verificarSesion
} from '../middlewares/sesion.middleware.js';

const router = Router();

router.post(
    '/registro',
    validarRegistroUsuario,
    registrarUsuario
);

router.get(
    '/perfil',
    verificarSesion,
    consultarPerfil
);

router.put(
    '/perfil',
    verificarSesion,
    validarActualizacionPerfil,
    modificarPerfil
);

router.put(
    '/contrasena',
    verificarSesion,
    validarCambioContrasena,
    cambiarContrasena
);

export default router;