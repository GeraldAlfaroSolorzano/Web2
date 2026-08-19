import { Router } from 'express';

import {
    login,
    logout,
    solicitarRecuperacion,
    restablecerContrasena
} from '../controllers/auth.controller.js';

import {
    validarLogin,
    validarSolicitudRecuperacion,
    validarRestablecerContrasena
} from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
    '/login',
    validarLogin,
    login
);

router.post(
    '/logout',
    logout
);

router.post(
    '/recuperar-contrasena',
    validarSolicitudRecuperacion,
    solicitarRecuperacion
);

router.post(
    '/restablecer-contrasena',
    validarRestablecerContrasena,
    restablecerContrasena
);

export default router;